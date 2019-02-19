import WS from 'ws';
import crypto from '../../app/platform/electron/crypto';
import testLog from './log4';

export default class Socket {
    constructor(url, options) {
        this.init(url, options);
    }

    init(url, options) {
        this.options = Object.assign({
            cipherIV: options.token.substr(0, 16),
            connect: true,
            connent: true,
            encryptEnable: true,
            userToken: options.token
        }, options);
        this.url = url;
        this.messageOrder = 0;
        this.startChatT = {};
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
        // console.log('data');
        if (data && data.data && this.onData) this.onData(data);
    }

    handleError(err) {
        console.log('error', err);
    }

    handleClose(code) {
        console.log('socket断开连接', code);
    }

    // 通过 Socket 连接向服务器发送数据
    send(rawdata, callback) {
        // console.log('send')
        // if (rawdata.method === 'message') this.startChatT[this.messageOrder] = new Date().getTime();
        rawdata = JSON.stringify(rawdata);
        const data = crypto.encrypt(rawdata, this.options.userToken, this.options.cipherIV);
        this.client.send(data, {
            binary: true
        }, callback);
    }

    close() {
        this.client.close();
    }
}
