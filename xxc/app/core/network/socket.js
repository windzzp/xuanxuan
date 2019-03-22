// eslint-disable-next-line import/no-unresolved
import md5 from 'md5';
import SocketMessage from './socket-message';
import events from '../events';
import Lang from '../lang';
import Config from '../../config';
import platform from '../../platform';

const Socket = platform.access('Socket');

/**
 * 等待消息回应判定为超时的事件，单位毫秒
 * @type {number}
 * @private
 */
const LISTEN_TIMEOUT = 1000 * 15;

/**
 * 事件名称表
 * @type {Object}
 * @private
 */
const EVENT = {
    message: 'app_socket.message',
};

/**
 * 根据消耗时间返回一个颜色值，用于表达所消耗时间的大小
 * @param {number} time 消耗时间
 * @return {string} 颜色值
 * @private
 */
const getPerfTimeColor = time => {
    if (time > 1000) {
        return 'red';
    }
    if (time > 200) {
        return 'orange';
    }
    if (time > 50) {
        return 'muted';
    }
    return 'green';
};

/**
 * 监听消息回应
 * @param {string} moduleName 消息操作模块名称
 * @param {string} methodName 消息操作方法名称
 * @param {number} [timeout=LISTEN_TIMEOUT]
 * @param {string} rid 请求 ID
 * @return {Promise}
 * @private
 */
const listenMessage = (moduleName, methodName, rid, timeout = LISTEN_TIMEOUT) => {
    return new Promise((resolve, reject) => {
        let listenHandler = null;
        const listenTimer = setTimeout(() => {
            if (listenHandler) {
                events.off(listenHandler);
            }
            reject();
        }, timeout);
        listenHandler = events.on(EVENT.message, (msg, result) => {
            if (msg.module === moduleName && msg.method === methodName && (!msg.rid || msg.rid === rid)) {
                if (listenTimer) {
                    clearTimeout(listenTimer);
                }
                if (listenHandler) {
                    events.off(listenHandler);
                }
                resolve(result);
            }
        });
    });
};

/**
 * Socket 服务管理类
 *
 * @export
 * @class AppSocket
 * @extends {Socket}
 */
export default class AppSocket extends Socket {
    /**
     * 创建一个 Socket 服务器管理类实例
     * @memberof AppSocket
     */
    constructor() {
        super();

        /**
         * 当前用户
         * @type {User}
         */
        this.user = null;

        /**
         * Socket 消息接收处理函数
         * @type {Object<string, Function>}
         */
        this.handlers = {};

        /**
         * 记录请求时间
         * @type {Object}
         * @private
         */
        this.requestTimes = DEBUG ? {} : null;
    }

    /**
     * 发送 SocketMessage
     *
     * @param {Object<string, any>|SocketMessage} msg 要发送的 SocketMessage 实例或者用于创建 SocketMessage 实例的属性对象
     * @returns {Promise} 使用 Promise 异步返回处理结果
     * @memberof AppSocket
     */
    send(msg) {
        return new Promise((resolve) => {
            msg = SocketMessage.create(msg);
            if (!msg.userID && msg.pathname !== 'chat/login') {
                msg.userID = this.user.id;
            }
            const startTime = DEBUG ? (process.uptime ? process.uptime() * 1000 : new Date().getTime()) : null;
            const rid = DEBUG ? msg.createRequestID() : null;
            super.send(msg.json, () => {
                if (DEBUG) {
                    msg.startSendTime = startTime;
                    if (startTime) {
                        const endTime = process.uptime ? process.uptime() * 1000 : new Date().getTime();
                        msg.endSendTime = endTime;
                        this.requestTimes[rid] = endTime;

                        // 清理之前的请求时间
                        const requestTimes = Object.keys(this.requestTimes);
                        if (requestTimes.length > 50) {
                            requestTimes.forEach(theRid => {
                                if ((endTime - requestTimes[theRid]) > 20000) {
                                    delete this.requestTimes[theRid];
                                }
                            });
                        }
                        const sendRequestTime = endTime - startTime;
                        this.perfData.sendCount += 1;
                        this.perfData.sendTotal += sendRequestTime;
                        this.perfData.sendAverate = this.perfData.sendTotal / this.perfData.sendCount;
                        console.collapse('Socket Send ⬆︎', 'indigoBg', msg.pathname, 'indigoPale', `${sendRequestTime} ms, averate ${this.perfData.sendAverate.toFixed(3)} ms`, getPerfTimeColor(sendRequestTime));
                    } else {
                        console.collapse('Socket Send ⬆︎', 'indigoBg', msg.pathname, 'indigoPale');
                    }
                    console.log('msg', msg);
                    console.groupEnd();
                }
                resolve(msg);
            });
        });
    }

    /**
     * 设置 Socket 消息接收处理函数
     * @param {string} moduleName 要处理的操作模块名称
     * @param {string} methodName 要处理的操作方法名称
     * @param {Function(msg: SocketMessage, socket: Socket)} func 处理函数
     * @return {void}
     * @memberof Socket
     */
    setHandler(pathname, func) {
        if (typeof pathname === 'object') {
            Object.keys(pathname).forEach(name => {
                this.handlers[name.toLowerCase()] = pathname[name];
            });
        } else {
            this.handlers[pathname.toLowerCase()] = func;
        }
    }

    /**
     * 获取消息接收处理函数
     * @param {...string} pathnames 操作路径
     * @return {Function(msg: SocketMessage, socket: Socket)}
     * @memberof Socket
     */
    getHandler(...pathnames) {
        const pathname = pathnames.join('/').toLowerCase();
        return this.handlers[pathname];
    }

    /**
     * 使用消息接收处理函数处理接收到的消息
     *
     * @param {SocketMessage} msg 要处理的消息实例
     * @memberof AppSocket
     * @return {void}
     */
    handleMessage(msg) {
        let responseTime = null;
        if (DEBUG && msg.rid) {
            const requestTime = this.requestTimes[msg.rid];
            if (requestTime) {
                delete this.requestTimes[msg.rid];
                const currentTime = process.uptime ? process.uptime() * 1000 : new Date().getTime();
                responseTime = currentTime - requestTime;

                this.perfData.count += 1;
                this.perfData.total += responseTime;
                this.perfData.average = this.perfData.total / this.perfData.count;
            }
        }

        // 处理登录时顺序不一致的问题
        const {waitingMessages} = this;
        if (waitingMessages) {
            const pathName = msg.pathname;
            if (pathName === 'chat/login' || pathName === 'chat/usergetlist') {
                waitingMessages[pathName] = msg;
            } else {
                if (!waitingMessages.others) {
                    waitingMessages.others = [];
                }
                waitingMessages.others.push(msg);
            }
            if (DEBUG) {
                if (responseTime) {
                    console.collapse('SOCKET WAITING Data ⬇︎', 'purpleBg', msg.pathname, 'purplePale', msg.isSuccess ? 'OK' : 'FAILED', msg.isSuccess ? 'greenPale' : 'dangerPale', `${responseTime} ms, average ${this.perfData.average.toFixed(3)} ms`, getPerfTimeColor(responseTime));
                } else {
                    console.collapse('SOCKET WAITING Data ⬇︎', 'purpleBg', msg.pathname, 'purplePale', msg.isSuccess ? 'OK' : 'FAILED', msg.isSuccess ? 'greenPale' : 'dangerPale');
                }
                console.log('msg', msg);
                console.log('socket', this);
                console.groupEnd();
            }
            if (waitingMessages['chat/login'] && waitingMessages['chat/usergetlist']) {
                this.waitingMessages = null;
                this.handleMessage(waitingMessages['chat/login']);
                this.handleMessage(waitingMessages['chat/usergetlist']);
                if (waitingMessages.others) {
                    waitingMessages.others.forEach(this.handleMessage.bind(this));
                }
            }
            return;
        }
        if (DEBUG) {
            if (responseTime) {
                console.collapse('SOCKET Data ⬇︎', 'purpleBg', msg.pathname, 'purplePale', msg.isSuccess ? 'OK' : 'FAILED', msg.isSuccess ? 'greenPale' : 'dangerPale', `${responseTime} ms, average ${this.perfData.average.toFixed(3)} ms`, getPerfTimeColor(responseTime));
            } else {
                console.collapse('SOCKET Data ⬇︎', 'purpleBg', msg.pathname, 'purplePale', msg.isSuccess ? 'OK' : 'FAILED', msg.isSuccess ? 'greenPale' : 'dangerPale');
            }
            console.log('msg', msg);
            console.log('socket', this);
            console.groupEnd();
        }

        let handler = this.getHandler(msg.module, msg.method);
        let result;
        if (handler) {
            while (handler && typeof handler === 'string') {
                handler = this.getHandler(handler);
            }
            if (handler) {
                result = handler(msg, this);
            }
        } else {
            result = msg.data;
        }
        if (result === undefined) {
            result = msg.isSuccess;
        }
        events.emit(EVENT.message, msg, result);
    }

    /**
     * 通过 Socket 发送消息并监听服务器对此消息的回应
     * @param {Object<string, any>|SocketMessage} msg 要发送的 SocketMessage 实例或者用于创建 SocketMessage 实例的属性对象
     * @param {function} check 用于检查服务器返回结果的函数
     * @returns {Promise} 使用 Promise 异步返回处理结果
     * @memberof AppSocket
     */
    sendAndListen(msg, check) {
        return new Promise((resolve, reject) => {
            msg = SocketMessage.create(msg);
            listenMessage(msg.module, msg.method, msg.createRequestID()).then((result) => {
                if (check) {
                    result = check(result);
                }
                if (result) {
                    resolve(result);
                } else {
                    reject();
                }
                return result;
            }).catch(reject);
            this.send(msg);
        });
    }

    /**
     * 当 Socket 初始化时执行的操作
     * @private
     * @return {void}
     * @memberof AppSocket
     */
    onInit() {
        this.lastHandTime = 0;
        if (DEBUG) {
            this.perfData = {
                count: 0,
                total: 0,
                sendCount: 0,
                sendTotal: 0,
            };
        }
    }

    /**
     * 当 Socket 关闭时执行的操作
     * @param {number} code 关闭代码
     * @param {string} reason 关闭原因
     * @param {boolean} unexpected 是否是意外关闭
     * @private
     * @return {void}
     * @memberof AppSocket
     */
    onClose(code, reason, unexpected) {
        if (this.user && this.user.isOnline) {
            this.user[unexpected ? 'markDisconnect' : 'markUnverified']();
        }
    }

    /**
     * 当 Socket 接收到数据时执行的操作
     * @param {string} data Socket 接收到的数据（通常是JSON 字符串形式）
     * @param {object} flags 数据标识
     * @private
     * @return {void}
     * @memberof AppSocket
     */
    onData(data) {
        const msg = SocketMessage.fromJSON(data);
        if (!msg) {
            if (DEBUG) {
                console.error('Cannot handle data:', data);
            }
            return;
        }
        this.lastHandTime = new Date().getTime();
        if (Array.isArray(msg)) {
            msg.forEach(x => {
                this.handleMessage(x);
            });
        } else {
            this.handleMessage(msg);
        }
    }

    /**
     * 发起登录请求
     *
     * @param {User} user 当前要进行登录的用户
     * @param {Object<string,any>} options 登录选项
     * @returns {Promise} 使用 Promise 异步返回处理结果
     * @memberof AppSocket
     */
    login(user, options) {
        this.isLogging = true;
        this.waitingMessages = {};
        return new Promise((resolve, reject) => {
            if (user) {
                this.user = user;
            } else {
                // eslint-disable-next-line prefer-destructuring
                user = this.user;
            }
            if (!user) {
                return Promise.reject(new Error('User is not defined.'));
            }
            const onConnect = () => {
                const loginRid = `login_${Config.system.device || 'desktop'}_${user.account}`;
                listenMessage('chat', 'login', loginRid).then((result) => {
                    this.isLogging = false;
                    if (result) {
                        this.syncUserSettings();
                        resolve(user);
                    } else {
                        reject(user.loginError || new Error('Login result is not success.'));
                    }
                    return result;
                }).catch(reject);
                user.loginError = null;
                this.send({
                    module: 'chat',
                    method: 'login',
                    params: [
                        user.serverName,
                        user.account,
                        user.passwordForServer,
                        'online'
                    ],
                    rid: loginRid
                });
            };
            this.init(user.socketUrl, Object.assign({
                userToken: user.token,
                cipherIV: user.cipherIV,
                version: Config.pkg.version,
                connect: true,
                onConnect,
                onConnectFail: e => {
                    this.isLogging = false;
                    reject(e);
                }
            }, options));
        });
    }

    /**
     * 发起退出登录请求
     *
     * @return {void}
     * @memberof AppSocket
     */
    logout() {
        if (this.isConnected) {
            this.uploadUserSettings();
            setTimeout(() => {
                this.markClose();
                this.send('logout');
            }, 500);
        } else {
            this.markClose();
            this.handleClose(null, 'logout');
        }
    }

    /**
     * 发起上传用户个人配置请求
     *
     * @param {boolean} [onlyChanges=false] 是否仅导出变更的部分
     * @returns {Promise} 使用 Promise 异步返回处理结果
     * @memberof AppSocket
     */
    uploadUserSettings(onlyChanges = false) {
        const {user} = this;
        const uploadSettings = user.config.exportCloud(onlyChanges);
        user.config.newChanges = null;
        if (!uploadSettings) {
            return Promise.resolve();
        }
        if (!this.isConnected || !user.isOnline) {
            if (DEBUG) {
                console.warn('Socket is disconnected, cannot upload user settings of', uploadSettings);
            }
            return Promise.resolve();
        }
        return this.sendAndListen({
            method: 'settings',
            params: [
                user.account,
                uploadSettings
            ]
        });
    }

    /**
     * 从服务器同步个人配置
     *
     * @returns {Promise} 使用 Promise 异步返回处理结果
     * @memberof AppSocket
     */
    syncUserSettings() {
        return this.sendAndListen({
            method: 'settings',
            params: [
                this.user.account,
                ''
            ]
        });
    }

    /**
     * 变更当前用户状态
     *
     * @param {string} status 状态名称
     * @returns {Promise} 使用 Promise 异步返回处理结果
     * @memberof AppSocket
     */
    changeUserStatus(status) {
        return this.changeUser({status});
    }

    /**
     * 变更用户信息
     *
     * @param {Object<string,any>} userChangeData 要变更的属性对象
     * @returns {Promise} 使用 Promise 异步返回处理结果
     * @memberof AppSocket
     */
    changeUser(userChangeData) {
        userChangeData.account = this.user.account;
        return this.sendAndListen({
            method: 'userchange',
            params: [userChangeData]
        });
    }

    /**
     * 修改用户密码
     *
     * @param {string} password 新的密码
     * @returns {Promise} 使用 Promise 异步返回处理结果
     * @memberof AppSocket
     */
    changeUserPassword(password) {
        if (this.user.ldap) {
            return Promise.reject(Lang.string('user.changePassword.notSupport'));
        }
        return this.changeUser({
            password: this.user.isVersionSupport('changePwdWithMD5') ? md5(password) : md5(`${md5(password)}${this.user.account}`)
        });
    }
}
