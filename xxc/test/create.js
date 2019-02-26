import program from 'commander';
import {URL} from 'url';
import Md5 from 'md5';
import User from './user';
import Server from './server';
import pkg from '../app/package.json';


// 创建人数，用户名，用户密码  测试服务器地址，
/**
 * 1. `--server, -s`： 测试服务器地址；
 * 2. `--account, -a`： 测试账号前缀 `--acount=test`；
 * 3. `--password, -p`：测试账号密码
 * 4. `--user, -u`：创建测试账号的数量 `100`
 */
program
    .version(pkg.version)
    .alias('npm run create --')
    .option('-s, --server <server>', '测试服务器地址')
    .option('-A, --admin <admin>', '创建用户的管理员账号 `--admin=admin`')
    .option('-M, --adminpassword <adminpassword>', '创建用户的管理员密码')
    .option('-a, --account <account>', '测试账号前缀，例如 `--acount=test`', 'test')
    .option('-p, --password <password>', '测试账号密码', '123456')
    .option('-u, --user <user>', '：创建测试账号的数量 `100`')
    // .option('-g, --group <group>', '：创建测试群的数量 `10`')
    .option('-P, --port <port>', 'Socket 连接端口', 11444)
    .option('-v, --verbose', '是否输出额外的信息', false)
    .parse(process.argv);

const config = {
    pkg,
    serverUrl: program.server,
    server: new URL(program.server),
    admin: program.admin,
    adminPassword: Md5(program.adminpassword),
    account: program.account,
    password: program.password,
    user: program.user,
    group: program.group,
    verbose: program.verbose,
    socketPort: program.port
};

/**
 * 初始化测试程序参数
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

    Object.assign(config, {
        serverInfoUrl: `${server.origin}/serverInfo`,
        serverName: server.username ? server.username : (server.pathname ? server.pathname.substr(1) : ''),
        socketUrl: socketUrl.toString()
    });
};

const create = () => {
    initConfig();
    const user = new User(config.admin, config.adminPassword);
    const server = new Server(user, config);
    server.connect().then(() => {
        const {user, account, password} = config;
        if (user && account && password) {
            server.createUsers(Number.parseInt(user, 10), account, password);
        }
        // if (config.group) server.createGroups(config.group);
    });
};

create();
