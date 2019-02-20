import request from 'request';
import Socket from './socket';

/**
 * 等待消息回应判定为超时的事件，单位毫秒
 * @type {number}
 * @private
 */
const LISTEN_TIMEOUT = 1000 * 15;

/**
 * 生成 Socket 数据包 rid 值，每次应该递增之后使用
 * @type {number}
 */
let ridSeed = 0;

/**
 * 事件名称表
 * @type {Object}
 * @private
 */
const EVENT = {
    messages: 'messages',
};

/**
 * Socket 连接状态
 * @type {Map<String, number>}
 */
const STATUS = {
    CONNECTING: 0, // 连接还没开启。
    OPEN: 1, // 连接已开启并准备好进行通信。
    CLOSING: 2, // 连接正在关闭的过程中。
    CLOSED: 3, // 连接已经关闭，或者连接无法建立。
    VERFIED: 4, // 连接已经打开且用户已经登录成功
};

export default class Server {
    constructor(user, config) {
        this.user = user;
        this.config = config;
        this._status = STATUS.CONNECTING;

        /**
         * 数据包发送结果回调函数
         * @type {Map<string, {callback: function, rejectTimer: number}>}
         * @private
         */
        this.messageCallbacks = {};
    }

    /**
     * 判断用户是否在线
     * @type {boolean}
     */
    get isOnline() {
        return this._status === 1;
    }

    /**
     * 获取 Socket 连接状态
     */
    set status(status) {
        if (typeof status === 'string') {
            status = STATUS[status.toUpperCase()];
        }
        if (this._status !== status) {
            this._status = status;
            if (this.onStatusChange) {
                this.onStatusChange(status);
            }
            console.log(`User<${this.user.account}> Socket 连接状态变更 ${this.statusName}`);
        }
    }

    /**
     * 获取服务器状态名称
     * @type {string}
     */
    get statusName() {
        return Object.keys(STATUS).find(x => STATUS[x] === this._status);
    }

    /**
     * 获取服务器信息
     * @returns {Promise} 使用 Promise 异步返回处理结果
     */
    getServerInfo() {
        const {config, user} = this;
        const {serverInfoUrl, pkg} = config;
        const {account, password} = user;
        this.postData = JSON.stringify({
            lang: 'zh-cn',
            method: 'login',
            module: 'chat',
            params: ['', account, password, 'online'],
            rid: 'login',
            v: pkg.version
        });
        return new Promise((resolve, reject) => {
            console.log('>> serverinfo.request', {
                url: serverInfoUrl,
                method: 'POST',
                json: true,
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                body: `data=${this.postData}`
            });
            request({
                url: serverInfoUrl,
                method: 'POST',
                json: true,
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                body: `data=${this.postData}`
            }, (error, response, body) => {
                if (error) {
                    console.log('Get server info error', error);
                    reject(error);
                    return;
                }
                if (!body) {
                    console.log('Get server info error, server not return content.');
                    reject(new Error('Get server info error, server not return content.'));
                    return;
                }
                if (response.statusCode === 200) {
                    resolve(body);
                } else {
                    console.log('Get server info error, status code is not 200.');
                    reject(new Error('Get server info error, status code is not 200.'));
                }
            });
        });
    }

    /**
     * 连接 Socket，并且执行登录操作
     * @returns {Promise} 使用 Promise 异步返回处理结果
     */
    connect() {
        return this.getServerInfo().then((serverInfo) => {
            console.log('serverInfo', serverInfo);
            return new Promise((resolve, reject) => {
                const {config} = this;
                const {socketUrl} = config;
                const {token} = serverInfo;
                this.token = token;
                const onConnect = () => {
                    this.status = STATUS.OPEN;
                    resolve();
                };
                try {
                    this.socket = new Socket(socketUrl, {
                        token,
                        onConnect,
                        onMessage: this.handleMessage
                    });
                } catch (error) {
                    reject(error);
                }
            });
        }).then(() => {
            const {socket} = this;
            socket.onMessage = this.handleSocketMessage;
            socket.onClose = this.handSocketClose;
            socket.onError = this.handSocketError;
            return this.login();
        });
    }

    /**
     * 发送登录数据包，执行登录操作
     * @returns {Promise} 使用 Promise 异步返回处理结果
     */
    login() {
        const {postData, user} = this;
        const {account} = user;
        delete this.postData;
        return this.sendAndListen(postData).then(message => {
            if (message && message.result === 'success' && message.data.account === account) {
                this.serverUser = message.data;
                this.status = STATUS.VERFIED;
                return Promise.resove(this.serverUser);
            }
            return Promise.reject(new Error('User login failed.'));
        });
    }

    /**
     * 处理接收到 Socket 数据包事件
     * @param {Object} message Socket 数据包对象
     * @return {void}
     */
    handleSocketMessage(message) {
        console.log('Socket.recevied', message);
        const {rid} = message;
        const messageCallback = this.messageCallbacks[rid];
        if (messageCallback) {
            if (messageCallback.callback) {
                messageCallback.callback(message);
            }
            if (messageCallback.rejectTimer) {
                clearTimeout(messageCallback.rejectTimer);
            }
            delete this.messageCallbacks[rid];
        }
    }

    /**
     * 处理 Socket 连接断开事件
     * @return {void}
     */
    handSocketClose() {
        this.status = STATUS.CLOSED;
    }

    /**
     * 处理 Socket 发生错误事件
     * @param {Error} error 错误对象
     * @return {void}
     */
    handleSocketError(error) {
        console.log('发生错误', error);
    }

    /**
     * 发送数据包
     * @return {void}
     */
    sendMessage(message, callback) {
        this.socket.send(message, callback);
        console.log('Socket.send', message);
    }

    /**
     * 发送消息并监听服务器返回的结果
     * @param {Object} message 要发送的数据包对象
     * @param {function} callback 本地发送成功之后的回调函数
     * @returns {Promise} 使用 Promise 异步返回处理结果
     */
    sendAndListen(message, callback) {
        if (!message.rid === undefined) {
            message.rid = ridSeed++;
        }
        console.log('Socket.sendAndListen', message);
        return new Promise((resolve, reject) => {
            this.sendMessage(message, callback);
            const {rid} = message;
            const rejectTimer = setTimeout(() => {
                if (this.messageCallbacks[rid]) {
                    delete this.messageCallbacks[rid];
                    reject();
                }
            }, LISTEN_TIMEOUT);
            this.messageCallbacks[rid] = {
                callback: resolve,
                rejectTimer
            };
        });
    }
}
