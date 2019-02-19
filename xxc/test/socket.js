import WS from 'ws';
import crypto from '../app/platform/electron/crypto';

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

export default class Socket {
    constructor(url, options) {
        this.options = Object.assign({
            cipherIV: options.token.substr(0, 16),
            userToken: options.token
        }, options);
        this.url = url;
        this.createTime = new Date().getTime();
        this.connect();
    }

    connect() {
        const client = new WS(this.url);

        client.on('open', this.handleConnect.bind(this));
        client.on('message', this.handleData.bind(this));
        client.on('close', this.handleClose.bind(this));
        client.on('error', this.handleError.bind(this));

        this.client = client;
    }

    // 开始连接
    handleConnect() {
        console.log('socket开始连接');
        if (this.options && this.options.onConnect) this.options.onConnect(this);
    }

    // 处理接收到数据
    handleData(rawdata, flags) {
        const data = JSON.parse(crypto.decrypt(rawdata, this.options.userToken, this.options.cipherIV));
        if (data) {
            if (Array.isArray(data)) {
                data.forEach(item => this.handleMessage(item));
            } else {
                this.handleMessage(data);
            }
        }
    }

    // 处理 Socket 消息
    handleMessage(message) {
        if (this.onMessage) {
            this.onMessage(message);
        }
    }

    handleError(error) {
        console.log('error', error);
    }

    handleClose(code) {
        console.log('socket断开连接', code);
    }

    // 通过 Socket 连接向服务器发送数据
    send(msg, callback) {
        msg = JSON.stringify(msg);
        const data = crypto.encrypt(msg, this.options.userToken, this.options.cipherIV);
        this.client.send(data, {
            binary: true
        }, callback);
    }

    close() {
        this.client.close();
    }
}
