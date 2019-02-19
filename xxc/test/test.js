import program from 'commander';
import pkg from '../app/package.json';
import User from './user';
import Server from './server';

/**
 * 1. `--server, -s`： 测试服务器地址；
 * 2. `--account, -a`： 测试账号 `--acount=test$`；
 * 3. `--password, -p`：测试账号密码
 * 4. `--range, -r`：登录的用户账号范围 `1,100`
 * 6. `--one2one, -o`：是否测试大量一对一聊天；
 * 7. `--group, -g`：是否测试全体成员讨论组聊天；
 * 8. `--login1, -l1`：设置登录场景1的最晚登录时间，默认 10 分钟（单位秒），例如 `--login1=600`
 * 9. `--login2, -l2`：设置登录场景2的瞬时登录可用时间，默认 10 秒中（单位秒），例如 `--login2=10`
 * 10. `--login3, -l3`：设置登录场景3每次登录时间间隔，默认 10 秒中（单位秒），例如 `--login3=10`
 * 11. `--reconnect, -R`：调用的用户是否立即重新登录，还是放弃
 */
program
    .version(pkg.version)
    .alias('npm run test2 --')
    .option('-s, --server <server>', '测试服务器地址')
    .option('-a, --account <account>', '测试账号，例如 `--acount=test$`')
    .option('-p, --password <password>', '测试账号密码')
    .option('-r, --range <range>', '登录的用户账号范围 `1,100`')
    .option('-l1, --login1 <timeForLogin1>', '设置登录场景1的最晚登录时间，默认 10 分钟（单位秒），例如 `--login1=600`')
    .option('-l2, --login2 <timeForLogin2>', '设置登录场景2的瞬时登录可用时间，默认 10 秒中（单位秒），例如 `--login2=10`')
    .option('-l3, --login3 <timeForLogin3>', '设置登录场景3每次登录时间间隔，默认 10 秒中（单位秒），例如 `--login3=10`')
    .option('-R, --reconnect', '是否将版本标记为 Beta 版本', false)
    .option('-v, --verbose', '是否输出额外的信息', false)
    .parse(process.argv);

const config = {
    pkg,
    serverUrl: program.server,
    server: new URL(program.server),
    account: program.account,
    password: program.password,
    range: program.range.split(',').map(Number.parseInt),
    timeForLogin1: program.timeForLogin1,
    timeForLogin2: program.timeForLogin2,
    timeForLogin3: program.timeForLogin3,
    reconnect: program.reconnect,
    verbose: program.verbose,
};

// 等待登录的用户队列
const waitUsers = [];

// 用户对应的服务管理对象
const servers = {};

/**
 * 初始化测试程序参数
 */
const initConfig = () => {
    const {server, serverUrl} = config;

    const socketUrl = new URL(serverUrl);
    socketUrl.protocol = socketUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    socketUrl.pathname = '/ws';
    socketUrl.port = this.socketPort;
            
    Object.assign(config, {
        accountID: config.range[0],
        serverInfoUrl: `${server.origin}/serverInfo`,
        serverName: server.username ? server.username : (server.pathname ? server.pathname.substr(1) : ''),
        socketUrl: socketUrl.toString()
    });
};

/**
 * 初始化用户等待登录队列
 * @return {number} 返回用户登录登录队列内用户数目
 */
const initWaitUsers = () => {
    const {account, range, password} = config;
    const rangeStart = range[0] || 1;
    const rangeEnd = range[1] || 10;
    for (let i = rangeStart; i < rangeEnd; ++i) {
        const user = new User(account.replace('$', i), password);
        waitUsers.push(user);
    }
    return waitUsers;
};

/**
 * 尝试从等待登录的用户队列中
 * @return {boolean} 如果为 true，表示登录了用户，如果为 false 表示队列中没有用户登录
 */
const tryConnectUser = () => {
    if (waitUsers.length) {
        const user = waitUsers.pop();
        const server = new Server(user, config);
        server.connect();
        servers[user.account] = server;
    }
    return false;
};

/**
 * 尝试选取一个用户来发送一条消息
 * @return {boolean} 如果为 true，表示发送了消息，如果为 false 没有发送消息
 */
const trySendMessage = () => {
};

/**
 * 开始进行测试
 * @return {void}
 */
const start = () => {
    initConfig();
    initWaitUsers();

    setInterval(() => {
        if (tryConnectUser()) {
            return;
        }
        if (trySendMessage()) {
            return;
        }
    }, 100);
};

start();
