import request from 'request';
import Socket from './socket';

let serverSocket = {};

/**
 * 用户登录和连接socket
 * @param {object} loginData 登录参数
 * @param {object} params 默认参数
 * @param {function} callback 回调
 */

export const init = (params, callback) => {
    const postData = JSON.stringify(params.loginData);
    request({
        url: params.xxbUrl,
        method: 'POST',
        json: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        body: `data=${postData}`
    }, (error, response, body) => {
        if (error) console.log(error);
        if (!error && response.statusCode === 200) {
            const onConnect = () => {
                serverSocket.send(params.loginData, () => {
                    callback(serverSocket);
                });
            };
            serverSocket = new Socket(params.xxdUrl, {
                token: body.token,
                onConnect
            });
        }
    });
};


/**
 * 创建用户
 * @param {number} amount 创建人数
 * @param {string} prifix 用户名称统一前缀
 * @param {string} password 统一用户密码
 */

export const createUsers = (amount, prifix, password) => {
    serverSocket.send({
        module: 'chat',
        method: 'createUser',
        params: [
            amount,
            prifix,
            password
        ],
        userID: serverSocket.userID,
        v: serverSocket.v,
        lang: serverSocket.lang
    });
};

/**
 * 创建群组
 * @param {number} amount 创建群组数
 */

export const createGroups = (amount) => {
    serverSocket.send({
        module: 'chat',
        method: 'createGroup',
        params: [amount],
        userID: serverSocket.userID,
        v: serverSocket.v,
        lang: serverSocket.lang
    });
};
