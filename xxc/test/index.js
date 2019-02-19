import Test from './modules/test';
import {testLog, mainLog} from './modules/log4';
import {init, createUsers, createGroups} from './modules/server';

const params = {
    xxbUrl: 'http://127.0.0.1:11443/serverInfo',
    xxdUrl: 'ws://127.0.0.1:11444/ws',
    version: '2.4.0',
    userName: 'test', // 数据库批量创建使用的用户名
    password: 'e10adc3949ba59abbe56e057f20f883e',
    sendMessageIntervl: 5 * 1000, // 设置用户间隔
    onlineUser: 0,
    content: '1931年图灵进入剑桥大学国王学院，毕业后到美国普林斯顿大学攻读博士学位，第二次世界大战爆发后回到剑桥，后曾协助军方破解德国的著名密码系统Enigma，帮助盟军取得了二战的胜利。2013年12月24日，在英国司法大臣克里斯·格雷灵（Chris Grayling）的要求下，英国女王向图灵颁发了皇家赦免。英国司法大臣宣布，“图灵的晚年生活因为其同性取向（同性恋）而被迫蒙上了一层阴影，我们认为当时的判决是不公的，这种歧视现象现在也已经得到了废除。为此，女王决定为这位伟人送上赦免，以此向其致敬。”图灵对于人工智能的发展有诸多贡献，提出了一种用于判定机器是否具有智能的试验方法，即图灵试验，至今，每年都有试验的比赛。此外，图灵提出的著名的图灵机模型为现代计算机的逻辑工作方式奠定了基础。',
    loginUsers: 10,
    loop: 10, // 设置发送信息循环的次数
    time: 60 * 1000, // 设置发送信息时间
    createUsers: 0, // 需要创建用户的数量
    loginData: {
        lang: 'zh-cn',
        method: 'login',
        module: 'chat',
        params: ['', 'admin', 'e10adc3949ba59abbe56e057f20f883e', 'online'],
        rid: 'login',
        v: '2.4.0'
    }
};

// 处理命令行传递的参数 使用格式 -t=1000 -l=10 -u=100 -cu=500
process.argv.forEach((element) => {
    const ele = element.split('=');
    switch (ele[0]) {
    case '-t': // 设置每个用户发送时间
        if (ele[1]) params.time = Number(ele[1]);
        break;
    case '-l': // 设置每个用户发送次数
        if (ele[1]) params.loop = Number(ele[1]);
        break;
    case '-u': // 设置登录的用户数量
        if (ele[1]) params.loginUsers = Number(ele[1]);
        break;
    case '-cu': // 创建用户的数量
        if (ele[1]) params.createUsers = Number(ele[1]);
        break;
    }
});

// 创建用户和群
init(params, (serverSocket) => {
    serverSocket.onData = (data) => {
        if (data.method === 'login' && data.module === 'chat') {
            if (data.result === 'success') {
                serverSocket.userID = data.data.id;
                serverSocket.v = data.data.v;
                serverSocket.lang = data.data.lang;
                // testLog.info('<' + data.data.account + '>登录成功');
                if (params.createUsers !== 0) createUsers(params.createUsers, params.name, params.userPassword); // 创建用户
                // createGroups(30); // 创建群
            } else {
                testLog.info('<>未登录成功');
            }
        } else if (data.module === 'chat' && data.method === 'createUser') {
            if (data.result === 'success') {
                testLog.info(`创建用户成功耗时: ${data.time}s，用户组：${JSON.stringify(data.data)}`);
            } else {
                testLog.info('创建用户失败');
            }
        } else if (data.module === 'chat' && data.method === 'createGroup') {
            if (data.result === 'success') {
                testLog.info(`创建群组成功耗时: ${data.time}s，群组：${data.data}`);
                serverSocket.close();
            } else {
                testLog.info('创建群组失败');
            }
        } else if (data.method === 'userGetList') {
            if (data.data) mainLog.info(`系统用户: ${data.data.length} 人.`);
            mainLog.info(`已在线用户: ${params.onlineUser} 人.`);
            mainLog.info(`此次登录用户: ${params.loginUsers} 人.`);
        }
    };
});

// 测试程序
const test = new Test();
test.init(params, () => {
    test.login((onlineUserNum, socket) => {
        // params.onlineUser = onlineUserNum;
        test.sendChatMessage(socket);
    });
});

// setInterval(() => {
//     const testX = new Test();
//     testX.init(() => {
//         testX.login(5, () => {
//             testX.sendChatMessage();
//         });
//     });
// }, 5 * 1000);
