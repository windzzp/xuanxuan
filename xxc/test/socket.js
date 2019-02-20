import WS from 'ws';
import crypto from '../app/platform/electron/crypto';

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
        console.log('>> handleData', data);
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

    // 处理 Socket 错误信息
    handleError(error) {
        if (this.onError) {
            this.onError(error);
        }
    }

    // 处理 Socket 关闭信息
    handleClose(code) {
        if (this.onClose) {
            this.onClose(code);
        }
    }

    // 通过 Socket 连接向服务器发送数据
    send(msg, callback) {
        msg = JSON.stringify(msg);
        const data = crypto.encrypt(msg, this.options.userToken, this.options.cipherIV);
        this.client.send(data, {
            binary: true
        }, callback);
    }

    // 关闭 Socket 连接
    close() {
        this.client.close();
    }
}
