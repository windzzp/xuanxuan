import request from 'request';
import uuid from 'uuid';
import Socket from './socket';
import log from './log';

/**
 * 等待消息回应判定为超时的事件，单位毫秒
 * @type {number}
 * @private
 */
export const LISTEN_TIMEOUT = 1000 * 60 * 1;

/**
 * 生成 Socket 数据包 rid 值，每次应该递增之后使用
 * @type {number}
 */
let ridSeed = 1;

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
    0: 'CONNECTING',
    1: 'OPEN',
    2: 'CLOSING',
    3: 'CLOSED',
    4: 'VERFIED'
};

const STATUS_COLORS = {
    CONNECTING: 'blue',
    OPEN: 'cyan',
    CLOSING: 'magenta',
    CLOSED: 'red',
    VERFIED: 'green',
};

export default class Server {
    static info(server) {
        const {statusName, user} = server;
        return `c:${STATUS_COLORS[statusName]}|⦿||** ${user.account}**`;
    }

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

        /**
         * 用户断线的次数
         * @type {number}
         */
        this.closeTimes = 0;

        /**
         * 用户重连的次数
         * @type {number}
         */
        this.reconnectTimes = 0;

        /**
         * 请求耗时统计
         * @type {{average: number, min: number, max: number, total: number, totalTimes: number, successTimes: number}}
         */
        this.requestTime = {
            average: 0,
            min: 99999999,
            max: 0,
            total: 0,
            totalTimes: 0,
            successTimes: 0,
        };

        /**
         * 响应耗时统计
         * @type {{average: number, min: number, max: number, total: number, totalTimes: number, successTimes: number, timeoutTimes: number}}
         */
        this.responseTime = {
            average: 0,
            min: 99999999,
            max: 0,
            total: 0,
            totalTimes: 0,
            successTimes: 0,
            // timeoutTimes: 0
        };

        /**
         * 发送数据包数目
         * @type {{average: number, min: number, max: number, total: number, totalTimes: number, successTimes: number, timeoutTimes: number}}
         */
        this.sendMessageTime = {
            average: 0,
            min: 99999999,
            max: 0,
            total: 0,
            totalTimes: 0,
            successTimes: 0,
            // timeoutTimes: 0
        };

        /**
         * 发送聊天消息数目
         * @type {{success: number, failure: number}}
         */
        this.sendChatMessageTimes = {
            success: 0,
            failure: 0,
        };

        /**
         * 每次登录的耗时
         * @type {number[]}
         */
        this.loginTimes = [];

        /**
         * 发送数据开始时间
         * @type {object{}}
         */
        this.sendTime = {};
    }

    /**
     * 获取登录总时间
     * @type {boolean}
     */
    get totalLoginTimes() {
        return this.loginTimes.reduce((a, b) => {
            return a + b;
        }, 0);
    }

    /**
     * 判断用户是否在线
     * @type {boolean}
     */
    get isOnline() {
        return this._status === STATUS.VERFIED;
    }

    /**
     * 判断用户是否正在登录
     *
     * @readonly
     * @memberof Server
     */
    get isConnecting() {
        return this._status === STATUS.CONNECTING;
    }

    /**
     * Socket 是否已经断开
     *
     * @readonly
     * @memberof Server
     */
    get isClosed() {
        return this._status === STATUS.CLOSED;
    }

    /**
     * 获取当前登录的用户 ID
     *
     * @readonly
     * @memberof Server
     */
    get userID() {
        const {serverUser} = this;
        return serverUser && serverUser.id;
    }

    /**
     * 获取 Socket 连接状态
     * @param {number} status 连接状态代码
     */
    set status(status) {
        if (typeof status === 'string') {
            status = STATUS[status.toUpperCase()];
        }
        if (this._status !== status) {
            const oldStatusName = this.statusName;
            this._status = status;
            if (this.onStatusChange) {
                this.onStatusChange(status);
            }
            if (status === STATUS.CLOSED && this.onSocketClosed) {
                this.closeTimes++;
                this.lastCloseTime = new Date().getTime();
                this.onSocketClosed();
            }
            const {statusName} = this;
            log.info(this.logInfo(), 'Socket status changed:', `c:${STATUS_COLORS[statusName]}|**${statusName}**`, '←', `c:${STATUS_COLORS[oldStatusName]}|**${oldStatusName}**`);
        }
    }

    /**
     * 获取服务器状态名称
     * @type {string}
     */
    get statusName() {
        return STATUS[this._status];
    }

    /**
     * 获取服务器信息
     * @returns {Promise} 使用 Promise 异步返回处理结果
     */
    getServerInfo() {
        const {config, user} = this;
        const {serverInfoUrl, pkg} = config;
        const {account, password} = user;
        this.postData = {
            lang: 'zh-cn',
            method: 'login',
            module: 'chat',
            params: ['', account, password, 'online'],
            v: pkg.version
        };
        return new Promise((resolve, reject) => {
            request({
                url: serverInfoUrl,
                method: 'POST',
                json: true,
                rejectUnauthorized: false,
                requestCert: true,
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                body: `data=${JSON.stringify(this.postData)}`
            }, (error, response, body) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!body) {
                    // log.error('Get server info error, server not return content.');
                    reject(new Error('Get server info error, server not return content.'));
                    return;
                }
                if (response.statusCode === 200) {
                    resolve(body);
                } else {
                    // log.error('Get server info error, status code is not 200.');
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
        if (this.isClosed) {
            log.info(this.logInfo(), 'Socket', 'c:yellow|**reconnect**', 'begin.');
        } else {
            log.info(this.logInfo(), 'Socket connect begin.');
        }
        this.startLoginTime = new Date().getTime();
        return this.getServerInfo().then((serverInfo) => {
            // log.info(x => x.log(serverInfo), `Server<${this.user.account}> Server Info`);
            log.info(this.logInfo(), 'Server info recevied, the token is', `**${serverInfo.token}**`);
            return new Promise((resolve, reject) => {
                const {config} = this;
                const {socketUrl, pkg} = config;
                const {token} = serverInfo;
                this.token = token;
                const onConnect = () => {
                    log.info(this.logInfo(), 'Server socket', `__${socketUrl}__`, 'connected.');
                    this.status = STATUS.OPEN;
                    resolve();
                };
                try {
                    this.socket = new Socket(socketUrl, {
                        token,
                        onConnect,
                        version: pkg.version,
                        onMessage: this.handleMessage
                    });
                    // log.info(`Server<${this.user.account}> Server socket created with token ${token}.`);
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
        }).catch(error => {
            log.error(() => console.error(error), `Server<${this.user.account}> socket connect error`);
        });
    }

    /**
     * 发送登录数据包，执行登录操作
     * @returns {Promise} 使用 Promise 异步返回处理结果
     */
    login() {
        const {postData, user} = this;
        const {account} = user;
        log.info(this.logInfo(), 'Socket login begin.');
        return this.sendAndListen(postData).then(message => {
            delete this.postData;
            if (message && message.result === 'success' && message.data.account === account) {
                this.serverUser = message.data;
                this.status = STATUS.VERFIED;
                if (this.lastLoginTime) {
                    this.reconnectTimes++;
                }
                this.lastLoginTime = new Date().getTime();
                this.loginTimes.push(this.lastLoginTime - this.startLoginTime);
                return Promise.resolve(this.serverUser);
            }
            return Promise.reject(new Error('User login failed.'));
        });
    }

    /**
     * 处理接收到 Socket 数据包事件
     * @param {Object} message Socket 数据包对象
     * @return {void}
     */
    handleSocketMessage = (message) => {
        if (!message.module || !message.method) {
            log.warn(() => console.log(message), `Server<${this.user.account}> socket recevied wrong data`);
        } else {
            // log.info(x => x.log(message), `Server<${this.user.account}> socket recevied message`);
            // log.info(this.logInfo(), 'Socket', `c:blue|**⬇︎ ${message.module}/${message.method}**`, 'rid', message.rid);
        }
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
    handSocketClose = (code, reason) => {
        this.status = STATUS.CLOSED;
        log.warn(this.logInfo(), 'Socket closed with code', `c:red|**${code}**`, 'reason is', reason);
    }

    /**
     * 处理 Socket 发生错误事件
     * @param {Error} error 错误对象
     * @return {void}
     */
    handleSocketError = (error) => {
        log.error(() => console.error(error), `Server<${this.user.account}> socket error`);
    }

    /**
     * 发送数据包
     * @return {void}
     */
    sendMessage(message, callback) {
        message = Object.assign({
            userID: this.userID,
            v: this.config.pkg.version,
            lang: 'zh-cn',
            module: 'chat',
        }, message);

        this.requestTime.totalTimes++;
        const startTime = process.uptime() * 1000;
        this.socket.send(message, () => {
            this.sendTime[message.rid] = process.uptime() * 1000;
            const time = (this.sendTime[message.rid] - startTime);
            this.requestTime.successTimes++;
            this.requestTime.total += time;
            this.requestTime.min = Math.min(this.requestTime.min, time);
            this.requestTime.max = Math.max(this.requestTime.max, time);
            this.requestTime.average = this.requestTime.total / this.requestTime.successTimes;
            if (callback) {
                callback();
            }
        });
        // log.info(x => x.log(message), `Server<${this.user.account}> socket send`);
        log.info(this.logInfo(), 'Socket', `c:cyan|**⬆︎ ${message.module}/${message.method}**`, 'rid', message.rid);
    }

    /**
     * 发送消息并监听服务器返回的结果
     * @param {Object} message 要发送的数据包对象
     * @param {function} callback 本地发送成功之后的回调函数
     * @returns {Promise} 使用 Promise 异步返回处理结果
     */
    sendAndListen(message, callback) {
        if (message.rid === undefined) {
            message.rid = ridSeed++;
        }
        return new Promise((resolve, reject) => {
            this.sendMessage(message, callback);
            this.responseTime.totalTimes++;
            const {rid} = message;
            const rejectTimer = setTimeout(() => {
                if (this.messageCallbacks[rid]) {
                    delete this.messageCallbacks[rid];
                    this.responseTime.timeoutTimes++;
                    const error = new Error(`Timeout, rid: ${rid}, more than ${LISTEN_TIMEOUT}ms not recevied server response.`);
                    error.code = 'TIMEOUT';
                    reject(error);
                }
            }, LISTEN_TIMEOUT);
            this.messageCallbacks[rid] = {
                callback: resolve,
                rejectTimer
            };
        }).then((message) => {
            const now = process.uptime() * 1000;
            const responseTime = now - this.sendTime[message.rid];
            this.responseTime.total += responseTime;
            this.responseTime.successTimes++;
            this.responseTime.average = this.responseTime.total / this.responseTime.successTimes;
            this.responseTime.min = Math.min(this.responseTime.min, responseTime);
            this.responseTime.max = Math.max(this.responseTime.max, responseTime);
            return Promise.resolve(message);
        });
    }
    /**
     * 创建用户
     * @param {number} amount 创建人数
     * @param {string} prifix 用户名称统一前缀
     * @param {string} password 统一用户密码
     */

    createUsers = (amount, prifix, password, startID = 1) => {
        this.sendMessage({
            method: 'createUser',
            params: [
                amount,
                prifix,
                password,
                startID
            ]
        });
        console.log('创建成功');
    };

    /**
     * 创建群组
     * @param {number} amount 创建群组数
     */
    createGroups = (amount) => {
        this.sendMessage({
            method: 'createGroup',
            params: [amount],
        });
    };

    /**
     * 发送聊天消息
     *
     * @param {Object} chatMessage
     * @memberof Server
     * @returns {Promise} 使用 Promise 异步返回处理结果
     */
    sendChatMessage(chatMessage) {
        chatMessage = Object.assign({
            user: this.userID,
            type: 'normal',
            gid: uuid.v4(),
            contentType: 'plain',
        }, chatMessage);
        if (chatMessage.content === undefined) {
            chatMessage.content = 'This is a test message.';
        }
        if (!chatMessage.cgid) {
            return Promise.reject(new Error('The cgid must provide to send a chat message.'));
        }
        log.info(this.logInfo(), 'Send message to', `**${chatMessage.cgid}**`, `_${chatMessage.content}_`);
        // log.info(x => x.log(chatMessage), 'ChatMessage');
        const startSendTime = process.uptime() * 1000;
        this.sendMessageTime.totalTimes++;
        return this.sendAndListen({
            method: 'message',
            params: [[chatMessage]],
            userID: this.userID,
        }).then(() => {
            const now = process.uptime() * 1000;
            const sendMessageTime = now - startSendTime;
            this.sendMessageTime.total += sendMessageTime;
            this.sendMessageTime.successTimes++;
            this.sendMessageTime.average = this.sendMessageTime.total / this.sendMessageTime.successTimes;
            this.sendMessageTime.min = Math.min(this.sendMessageTime.min, sendMessageTime);
            this.sendMessageTime.max = Math.max(this.sendMessageTime.max, sendMessageTime);
            return Promise.resolve();
        }).catch(error => {
            if (error && error.code === 'TIMEOUT') {
                this.sendMessageTime.timeoutTimes++;
            }
            log.error(() => console.error(error), `Send chat message ${chatMessage.gid}@${chatMessage.cgid} error`);
        });
    }

    logInfo() {
        return Server.info(this);
    }
}
