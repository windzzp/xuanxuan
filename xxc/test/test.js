import program from 'commander';
import Md5 from 'md5';
import {URL} from 'url';
import {createJSONReport, createHTMLReport} from './report';
import pkg from '../app/package.json';
import User from './user';
import Server, {LISTEN_TIMEOUT, serverOnlineInfo} from './server';
import log, {initLogFile} from './log';
import {formatDate} from '../app/utils/date-helper';

// 处理命令行参数
program
    .version(pkg.version)
    .alias('npm run test --')
    .option('-s, --server <server>', '测试服务器地址')
    .option('-t, --time <time>', '测试持续时间，单位秒', 30 * 60)
    .option('-a, --account <account>', '测试账号，例如 `--acount=test$`', 'test$')
    .option('-p, --password <password>', '测试账号密码', '123456')
    .option('-r, --range <range>', '登录的用户账号范围，例如 `1,100` 表示 account1 到 account100', '1,2')
    .option('-L, --login1 <login1>', '设置登录场景1的最晚登录时间，默认 10 分钟（单位秒），例如 `--login1=600`')
    .option('-O, --login2 <login2>', '设置登录场景2的瞬时登录可用时间，默认 10 秒中（单位秒），例如 `--login2=10`')
    .option('-G, --login3 <login3>', '设置登录场景3每次登录时间间隔，默认 10 秒中（单位秒），例如 `--login3=10`')
    .option('-R, --reconnect', '是否断线重连', false)
    .option('-P, --port <port>', 'Socket 连接端口', 11444)
    .option('-v, --verbose', '是否输出额外的信息', false)
    .option('-o, --one2one', '是否测试大量一对一发送消息')
    .option('-g, --groups <groups>', '是否测试讨论组发送消息')
    .option('-A, --activeLevel <activeLevel>', '测试用户活跃程度', 0.5)
    .option('-n, --reportName <reportName>', '测试报告名称')
    .option('-S, --summaryInterval <summaryInterval>', '单次汇总时间间隔，单位秒', 30)
    .option('-U, --autoSaveReportInterval <autoSaveReportInterval>', '自动保存报告时间间隔，单位秒', 60)
    .option('-T, --logTypes <logTypes>', '日志报告文件类型', 'log,json,md,html')
    .option('-m, --multiLogin', '是否启用多用户同时登录')
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
    one2one: !!program.one2one,
    groups: program.groups ? program.groups.split(',') : false,
    activeLevel: typeof program.activeLevel === 'string' ? Number.parseFloat(program.activeLevel) : program.activeLevel,
    testTime: program.time * 1000,
    multiLogin: program.multiLogin,
    reportName: program.reportName,
    autoSaveReportInterval: program.autoSaveReportInterval * 1000,
    summaryInterval: program.summaryInterval * 1000,
    logTypes: new Set(program.logTypes.split(',')),
};

// 等待登录的用户队列
const waitUsers = [];

// 用户对应的服务管理对象
const servers = {};

// 启动测试的时间
const startTestTime = new Date().getTime();

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

// 当前循环的时间
let loopTime = 0;

// 测试时间是否消耗完
let isTestTimeOut = false;

// 上次生成汇总报告的时间
let lastSummaryReportTime = 0;

// 汇总报告数据列表
const summaryReportItems = [];

// 上次自动保存报告时间
let lastSaveReportTime = 0;

// 服务状态
const serverStatus = {
    online: 0,
    offline: 0,
    connecting: 0,
    wait: 0
};

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
        testTime: config.testTime,
        reportName: config.reportName,
        summaryInterval: config.summaryInterval,
        autoSaveReportInterval: config.autoSaveReportInterval,
        logTypes: config.logTypes,
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
    log.info(server.logInfo(), `Connect at #${user.connectID} order and`, (lastUserConnectTime - startConnectTime) / 1000, 'th seconds.');
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
                        content: `This is a one2one message between **@${twoServers[0].user.account}** and **@${twoServers[1].user.account}**.`
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
                        content: `This is a test message send to group **#${groupGid}** from @${onlineServer[0].user.account}.`
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
        log.info('Status', onlineCount ? `**c:green|Online: ${onlineCount}**` : '_Online: 0_', offlineCount ? `**c:red|Offline: ${offlineCount}**` : '_Offline: 0_', connectingCount ? `**c:yellow|Connecting: ${connectingCount}**` : '_Connecting: 0_', waitCount ? `**c:blue|Wait: ${waitCount}**` : '_Wait: 0_', '_/_', `**c:green|Server Online: ${serverOnlineInfo.online}/${serverOnlineInfo.total}**`);
        serverStatus.online = onlineCount;
        serverStatus.offline = offlineCount;
        serverStatus.connecting = connectingCount;
        serverStatus.wait = waitCount;
        return true;
    }
    return false;
};

/**
 * 获取当前统计信息
 * @returns {Object} 统计数据对象
 */
const getStatisticData = () => {
    const now = new Date().getTime();
    const statistic = {
        loginUserCount: 0, // 登录用户数目
        onlineUserCount: 0, // 在线用户数目
        closeTimes: 0, // 断线次数
        reconnectTimes: 0, // 重连次数
        updateTime: now,
        serverOnlineInfo: Object.assign({}, serverOnlineInfo),
        serverStatus: Object.assign({}, serverStatus),
        mins: (now - startTestTime) / (1000 * 60),
        loginTimeInfo: {
            all: null,
            average: 0,
            min: Number.MAX_SAFE_INTEGER,
            max: 0,
            total: 0,
            totalTimes: 0,
            successTimes: 0,
        },
        requestTimeInfo: {
            average: 0,
            min: Number.MAX_SAFE_INTEGER,
            max: 0,
            total: 0,
            totalTimes: 0,
            successTimes: 0,
        }, // 请求耗时（最低值，平均值，最高值）
        responseTimeInfo: {
            average: 0,
            min: Number.MAX_SAFE_INTEGER,
            max: 0,
            total: 0,
            totalTimes: 0,
            successTimes: 0,
        }, // 响应耗时（最低值，平均值，最高值）
        sendMessageTimeInfo: {
            average: 0,
            min: Number.MAX_SAFE_INTEGER,
            max: 0,
            total: 0,
            totalTimes: 0,
            successTimes: 0,
        } // 发送聊天消息数目（成功数目、失败数目）
    };
    Object.keys(servers).forEach(account => {
        const server = servers[account];
        const serverStatistic = server.getStatisticInfo();
        statistic.loginUserCount++;
        if (server.isOnline) {
            statistic.onlineUserCount++;
        }
        statistic.closeTimes += serverStatistic.closeTimes;
        statistic.reconnectTimes += serverStatistic.reconnectTimes;

        ['loginTimeInfo', 'requestTimeInfo', 'responseTimeInfo', 'sendMessageTimeInfo'].forEach(propName => {
            const info = statistic[propName];
            const serverInfo = serverStatistic[propName];
            info.min = Math.min(serverInfo.min, info.min);
            info.max = Math.max(serverInfo.max, info.max);
            info.total += serverInfo.total;
            info.totalTimes += serverInfo.totalTimes;
            info.successTimes += serverInfo.successTimes;
            statistic[propName] = info;
        });
    });
    ['loginTimeInfo', 'requestTimeInfo', 'responseTimeInfo', 'sendMessageTimeInfo'].forEach(propName => {
        const info = statistic[propName];
        info.average = info.total / info.successTimes;
        statistic[propName] = info;
    });

    return statistic;
};

/**
 * 获取用户统计信息
 * @return {object}
 */
const getUsersInfo = () => {
    const usersInfo = {};
    Object.keys(servers).forEach(account => {
        const server = servers[account];
        usersInfo[account] = server.getStatisticInfo();
    });
    return usersInfo;
};

const createStatisticReport = () => {
    const reportTime = new Date().getTime();
    log.info(`Create statistic report data at ${formatDate(reportTime)}.`);
    const data = {
        name: config.reportName || `XXC Test Report ${formatDate(reportTime)}`,
        reportTime,
        config,
        startTestTime,
        users: getUsersInfo(),
        timeline: summaryReportItems,
    };

    const {logTypes} = config;

    if (logTypes.has('json')) {
        const reportDataPath = `./test/logs/statistic-${formatDate(startTestTime, 'yyyyMMddhhmmss')}.json`;
        createJSONReport(data, reportDataPath);
        log.info(`Statistic report (json) data saved to ||__${reportDataPath}__||.`);
    }

    if (logTypes.has('html')) {
        const reportDataPath = `./test/logs/statistic-${formatDate(startTestTime, 'yyyyMMddhhmmss')}.html`;
        createHTMLReport(data, reportDataPath);
        log.info(`Statistic report (html) data saved to ||__${reportDataPath}__||.`);
    }
};

/**
 * 开始进行测试
 * @return {void}
 */
const start = () => {
    initLogFile(`./test/logs/cli-${formatDate(startTestTime, 'yyyyMMddhhmmss')}.log`);

    initConfig();
    initWaitUsers();

    startConnectTime = process.uptime() * 1000;

    const loopTimer = setInterval(() => {
        loopTime = process.uptime() * 1000;
        if ((loopTime - lastSummaryReportTime) > config.summaryInterval) {
            lastSummaryReportTime = loopTime;
            summaryReportItems.push(getStatisticData());
        }

        if (tryReportUserStatus()) {
            return;
        }

        if (config.testTime) {
            const consumeTime = loopTime - startConnectTime;
            if (consumeTime > config.testTime) {
                if (!isTestTimeOut) {
                    isTestTimeOut = true;
                    log.info(`**c:yellow|Test time (${Math.floor(config.testTime / 1000)}s) is out, waiting (${Math.floor(LISTEN_TIMEOUT / 1000)}s) for the remaining response.**`);
                }
                if (consumeTime > (config.testTime + LISTEN_TIMEOUT)) {
                    clearInterval(loopTimer);
                    createStatisticReport();
                    log.info('**c:green|All test finished.**');
                    console.log('Press Ctrl+C to exit...');
                }
                return;
            }
            if (config.autoSaveReportInterval && (loopTime - lastSaveReportTime) > config.autoSaveReportInterval) {
                lastSaveReportTime = loopTime;
                createStatisticReport();
            }
        }

        if ((!isUserConnecting || config.multiLogin) && tryConnectUser()) {
            return;
        }
        if (trySendMessage()) {
            return;
        }
        if ((loopTime - serverOnlineInfo.updateTime) > 60 * 1000 * 2) {
            const server = getOnlineServers(1)[0];
            if (server) {
                server.fetchUserList();
            }
        }
    }, 50);

    log.info(`Test started at ${formatDate()}.`);
};

start();
