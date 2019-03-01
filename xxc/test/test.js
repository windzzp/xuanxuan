import program from 'commander';
import Md5 from 'md5';
import {URL} from 'url';
import {makeReport} from './report';
import pkg from '../app/package.json';
import User from './user';
import Server from './server';
import log from './log';

// 处理命令行参数
program
    .version(pkg.version)
    .alias('npm run test2 --')
    .option('-s, --server <server>', '测试服务器地址')
    // .option('-t, --time <time>', '测试持续时间，单位秒', 30 * 60)
    .option('-a, --account <account>', '测试账号，例如 `--acount=test$`', 'test$')
    .option('-p, --password <password>', '测试账号密码', '123456')
    .option('-r, --range <range>', '登录的用户账号范围，例如 `1,100` 表示 account1 到 account100', '1,2')
    .option('-L, --login1 <login1>', '设置登录场景1的最晚登录时间，默认 10 分钟（单位秒），例如 `--login1=600`')
    .option('-O, --login2 <login2>', '设置登录场景2的瞬时登录可用时间，默认 10 秒中（单位秒），例如 `--login2=10`')
    .option('-G, --login3 <login3>', '设置登录场景3每次登录时间间隔，默认 10 秒中（单位秒），例如 `--login3=10`')
    .option('-R, --reconnect', '是否断线重连', false)
    .option('-P, --port <port>', 'Socket 连接端口', 11444)
    .option('-v, --verbose', '是否输出额外的信息', false)
    // .option('-l, --log <log>', '日志输出等级', 2)
    .option('-o, --one2one', '是否测试大量一对一发送消息')
    .option('-g, --groups <groups>', '是否测试讨论组发送消息')
    .option('-A, --activeLevel <activeLevel>', '测试用户活跃程度', 0.8)
    // .option('-T, --logTypes <logTypes>', '日志报告文件类型', 'log,json,md,html')
    .option('-T, --testTime <testTime>', '测试脚本执行的时间，单位秒', 120)
    .parse(process.argv);

// 测试配置
const config = {
    pkg,
    serverUrl: program.server,
    server: new URL(program.server),
    account: program.account,
    password: Md5(program.password),
    range: program.range.split(',').map(x => Number.parseInt(x, 10)),
    timeForLogin1: program.login1 ? program.login1 * 1000 : null,
    timeForLogin2: program.login2 ? program.login2 * 1000 : null,
    timeForLogin3: program.login3 ? program.login3 * 1000 : null,
    reconnect: program.reconnect,
    verbose: program.verbose,
    socketPort: program.port,
    one2one: program.one2one,
    groups: program.groups ? program.groups.split(',') : null,
    activeLevel: program.activeLevel,
    testTime: program.testTime * 1000,
};

// 等待登录的用户队列
const waitUsers = [];

// 用户对应的服务管理对象
const servers = {};

// 用户进行批量登录时的时间
let startConnectTime = null;

// 上一个用户登录的时间
let lastUserConnectTime = null;

// 用户登录顺序 ID
let connectID = 1;

// 当前是否有用户正在登录中
let isUserConnecting = false;

// 上次报告用户状态时间
let lastReportUserTime = 0;

// 每隔多长时间报告用户状态
const reportUserTimeInterval = 10 * 1000;

// 上次尝试发送一对一消息的时间
let lastTrySendOne2OneMessage = 0;

// 每隔多长时间尝试发送一对一消息
const trySendOne2OneMessageInterval = 1000;

// 上次尝试发送讨论组消息的时间
let lastTrySendGroupMessage = 0;

// 每隔多长时间尝试发送讨论组消息
const trySendGroupMessageInterval = 1000;

// 获取指定范围内的整数
const randomInt = (min, max) => {
    return Math.round(Math.random() * (max - min)) + min;
};

/**
 * 初始化测试程序参数
 * @return {void}
 */
const initConfig = () => {
    const {server, serverUrl, socketPort} = config;

    if (!server.port) {
        server.port = 11443;
    }

    const socketUrl = new URL(serverUrl);
    socketUrl.protocol = socketUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    socketUrl.pathname = '/ws';
    socketUrl.port = socketPort;

    if (!config.timeForLogin1 && !config.timeForLogin2 && !config.timeForLogin3) {
        config.timeForLogin3 = 10;
    }

    Object.assign(config, {
        accountID: config.range[0],
        serverInfoUrl: `${server.origin}/serverInfo`,
        serverName: server.username ? server.username : (server.pathname ? server.pathname.substr(1) : ''),
        socketUrl: socketUrl.toString(),
        loginType: config.timeForLogin1 ? 1 : config.timeForLogin2 ? 2 : 3
    });

    // 生成config 报表
    makeReport(config, 'config');

    log.info(x => x.log({
        server: config.server.toString(),
        account: config.account,
        password: program.password,
        range: config.range,
        timeForLogin1: config.timeForLogin1,
        timeForLogin2: config.timeForLogin2,
        timeForLogin3: config.timeForLogin3,
        reconnect: config.reconnect,
        verbose: config.verbose,
        socketPort: config.socketPort,
        loginType: config.loginType,
        testTime: config.testTime
    }), 'Config');
    log.info('Login type is', config.loginType);
};

/**
 * 初始化用户等待登录队列
 * @return {number} 返回用户登录登录队列内用户数目
 */
const initWaitUsers = () => {
    const {
        account, range, password, activeLevel
    } = config;
    const rangeStart = range[0] || 1;
    const rangeEnd = range[1] || 10;
    const {timeForLogin1} = config;
    for (let i = rangeStart; i <= rangeEnd; ++i) {
        const user = new User(account.replace('$', i), password, activeLevel);
        if (timeForLogin1) {
            user.timeForLogin1 = Math.random() * timeForLogin1;
        }
        waitUsers.push(user);
    }
    if (timeForLogin1) {
        waitUsers.sort((x, y) => (x.timeForLogin1 - y.timeForLogin1));
    }

    log.info('Waiting users count:', waitUsers.length);

    return waitUsers;
};

/**
 * 执行登录连接操作
 * @param {User} user 要执行登录连接操作的用户
 * @returns {Promise} 使用 Promise 异步返回处理结果
 */
const connectUser = (user) => {
    isUserConnecting = true;
    user.connectID = connectID++;
    let server = servers[user.account];
    if (!server) {
        server = new Server(user, config);
        servers[user.account] = server;
        if (config.reconnect) {
            server.onSocketClosed = () => {
                waitUsers.push(user);
            };
        }
    }
    lastUserConnectTime = process.uptime() * 1000;
    log.info(`User #${user.connectID}`, `**<${user.account}>**`, 'connect at', (lastUserConnectTime - startConnectTime) / 1000, 's');
    return server.connect().then(() => {
        isUserConnecting = false;
    });
};

/**
 * 尝试从等待登录的用户队列中选取一个用户进行连接
 * @return {boolean} 如果为 true，表示登录了用户，如果为 false 表示队列中没有用户登录
 */
const tryConnectUser = () => {
    if (waitUsers.length) {
        const {timeForLogin1, timeForLogin2, timeForLogin3} = config;
        if (timeForLogin1) {
            const user = waitUsers[0];
            const now = process.uptime() * 1000;
            if ((now - startConnectTime) >= user.timeForLogin1) {
                connectUser(user);
                waitUsers.splice(0, 1);
            }
        } else if (timeForLogin2) {
            const user = waitUsers.shift();
            connectUser(user);
        } else {
            const now = process.uptime() * 1000;
            if ((now - lastUserConnectTime) >= timeForLogin3) {
                const user = waitUsers.shift();
                connectUser(user);
            }
        }
        if (!waitUsers.length) {
            log.info('c:green|All users connected to server.');
        }
    }
    return false;
};

/**
 * 获取测试服务
 * @param {function} filter 过滤函数
 */
const getServers = (filter) => {
    const filterServers = Object.keys(servers).map(x => servers[x]);
    return filter ? filterServers.filter(filter) : filterServers;
};

/**
 * 随机获取指定数目的在线用户
 * @param {number} number 获取在线用户的数目
 */
const getOnlineServers = (number) => {
    const onlineServers = getServers(x => x.isOnline);
    if (!number || number >= onlineServers.length) {
        return onlineServers;
    }
    const matchServers = [];
    for (let i = 0; i < number; ++i) {
        const selectIndex = randomInt(0, onlineServers.length - 1);
        const selectServer = onlineServers[selectIndex];
        onlineServers.splice(selectIndex, 1);
        matchServers.push(selectServer);
    }
    return matchServers;
};

/**
 * 尝试发送一对一消息
 * @returns {boolean} 如果返回 `true` 则为是，否则为不是
 */
const trySendOne2OneMessage = () => {
    const {one2one} = config;
    if (one2one) {
        const now = process.uptime() * 1000;
        if (!lastTrySendOne2OneMessage || (now - lastTrySendOne2OneMessage) > trySendOne2OneMessageInterval) {
            lastTrySendOne2OneMessage = now;
            const twoServers = getOnlineServers(2);
            if (twoServers.length > 1) {
                if (Math.random() > twoServers[0].user.activeLevel) {
                    const cgid = twoServers.map(x => x.userID).sort().join('&');
                    twoServers[0].sendChatMessage({
                        cgid,
                        contentType: 'text',
                        content: `This is a one2one message between **${twoServers[0].user.account}** and **${twoServers[1].user.account}**.`
                    });
                    return true;
                }
            }
        }
    }
    return false;
};

/**
 * 尝试发送消息到系统聊天
 * @returns {boolean} 如果返回 `true` 则为是，否则为不是
 */
const trySendGroupMessage = () => {
    const {groups} = config;
    if (groups && groups.length) {
        const now = process.uptime() * 1000;
        if (!lastTrySendGroupMessage || (now - lastTrySendGroupMessage) > trySendGroupMessageInterval) {
            lastTrySendGroupMessage = now;
            const onlineServer = getOnlineServers(1);
            if (onlineServer.length) {
                if (Math.random() > onlineServer[0].user.activeLevel) {
                    const groupGid = groups[randomInt(0, groups.length - 1)];
                    onlineServer[0].sendChatMessage({
                        cgid: groupGid,
                        contentType: 'text',
                        content: `This is a test message send to group#${groupGid} from ${onlineServer[0].user.account}.`
                    });
                    return true;
                }
            }
        }
    }
    return false;
};

/**
 * 尝试选取一个用户来发送一条消息
 * @return {boolean} 如果为 true，表示发送了消息，如果为 false 没有发送消息
 */
const trySendMessage = () => {
    if (trySendOne2OneMessage()) {
        return true;
    }
    if (trySendGroupMessage()) {
        return true;
    }
    return false;
};

/**
 * 尝试报告用户状态
 * @returns {boolean} 如果返回 `true` 则为是，否则为不是
 */
const tryReportUserStatus = () => {
    const now = process.uptime() * 1000;
    if (!lastReportUserTime || (now - lastReportUserTime) > reportUserTimeInterval) {
        lastReportUserTime = now;
        let onlineCount = 0;
        let offlineCount = 0;
        let connectingCount = 0;
        Object.keys(servers).forEach(account => {
            const server = servers[account];
            if (server.isOnline) {
                onlineCount++;
            } else if (server.isConnecting) {
                connectingCount++;
            } else {
                offlineCount++;
            }
        });
        const waitCount = waitUsers.length;
        log.info('Status', onlineCount ? `**c:green|Online: ${onlineCount}**` : '_Online: 0_', offlineCount ? `**c:red|Offline: ${offlineCount}**` : '_Offline: 0_', connectingCount ? `**c:yellow|Connecting: ${connectingCount}**` : '_Connecting: 0_', waitCount ? `**c:blue|Wait: ${waitCount}**` : '_Wait: 0_');
        return true;
    }
    return false;
};

/**
 * 获取概要统计信息
 */
const getStatistic = () => {
    const statistic = {
        loginType: config.loginType, // 登录场景
        loginUserCount: 0, // 登录用户数目
        onlineUserCount: 0, // 在线用户数目
        totalLoginTimes: 0, // 所有用户登录完成耗时（平均登录耗时，最小，最大）
        closeTimes: 0, // 断线次数
        reconnectTimes: 0, // 重连次数
        requestTime: {
            average: 0,
            min: 99999999,
            max: 0,
            total: 0,
            totalTimes: 0,
            successTimes: 0,
        }, // 请求耗时（最低值，平均值，最高值）
        responseTime: {
            average: 0,
            min: 9999999,
            max: 0,
            total: 0,
            totalTimes: 0,
            successTimes: 0,
        }, // 响应耗时（最低值，平均值，最高值）
        sendMessageTime: {
            average: 0,
            min: 99999999,
            max: 0,
            total: 0,
            totalTimes: 0,
            successTimes: 0,
        } // 发送聊天消息数目（成功数目、失败数目）
    };
    Object.keys(servers).forEach(account => {
        const server = servers[account];
        statistic.loginUserCount++;
        if (server.isOnline) {
            statistic.onlineUserCount++;
        }
        statistic.totalLoginTimes += server.totalLoginTimes;
        statistic.closeTimes += server.closeTimes;
        statistic.reconnectTimes += server.reconnectTimes;
        handleTime(statistic, server.requestTime, 'requestTime');
        handleTime(statistic, server.responseTime, 'responseTime');
        handleTime(statistic, server.sendMessageTime, 'sendMessageTime');
    });
    statistic.requestTime.average = statistic.requestTime.total / statistic.requestTime.successTimes;
    statistic.responseTime.average = statistic.responseTime.total / statistic.responseTime.successTimes;
    statistic.sendMessageTime.average = statistic.sendMessageTime.total / statistic.sendMessageTime.successTimes;

    return statistic;
};

// 将信息汇总
const handleTime = (statistic, obj, type) => {
    Object.keys(obj).forEach(dataType => {
        switch (dataType) {
        case 'min':
            statistic[type][dataType] = Math.min(statistic[type][dataType], obj[dataType]);
            break;
        case 'max':
            statistic[type][dataType] = Math.max(statistic[type][dataType], obj[dataType]);
            break;
        case 'total':
            statistic[type][dataType] += obj[dataType];
            break;
        case 'totalTimes':
            statistic[type][dataType] += obj[dataType];
            break;
        case 'successTimes':
            statistic[type][dataType] += obj[dataType];
            break;
        }
    });
};

/**
 * 获取用户统计信息
 * @return {object}
 */
const getUsersInfo = () => {
    const usersInfo = {};
    Object.keys(servers).forEach(account => {
        const server = servers[account];
        usersInfo[account] = {};
        usersInfo[account].lastLoginTime = server.lastLoginTime; // 登录时间
        usersInfo[account].loginTimes = server.loginTimes; // 登录耗时
        usersInfo[account].closeTimes = server.closeTimes; // 断线次数
        usersInfo[account].reconnectTimes = server.reconnectTimes; // 重连次数
        usersInfo[account].requestTime = server.requestTime; // 请求耗时
        usersInfo[account].responseTime = server.responseTime; // 响应耗时
        usersInfo[account].sendMessageTime = server.sendMessageTime; // 发送聊天消息数目
    });
    return usersInfo;
};

/**
 * 开始进行测试
 * @return {void}
 */
const start = () => {
    initConfig();
    initWaitUsers();

    startConnectTime = process.uptime() * 1000;

    let timer = setInterval(() => {
        if (tryReportUserStatus()) {
            return;
        }
        if (!isUserConnecting && tryConnectUser()) {
            return;
        }
        trySendMessage();
    }, 100);

    if (config.testTime) {
        let clearTimer = setTimeout(() => {
            const statistic = getStatistic();
            const usersInfo = getUsersInfo();
            clearInterval(timer);
            clearTimeout(clearTimer);
            clearTimer = null;
            makeReport(statistic, 'statistic');
            makeReport(usersInfo, 'usersInfo');
            log.info('Test time out.');
        }, config.testTime);
    }
    log.info('Test started.');
};

start();
