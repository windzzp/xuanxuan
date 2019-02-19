import request from 'request';
import Socket from './modules/socket';

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
    }

    get isOnline() {
        return this._status === 1;
    }

    set status(status) {
        if (typeof status === 'string') {
            status = STATUS[status.toUpperCase()];
        }
        if (this._status !== status) {
            this._status = status;
            if (this.onStatusChange) {
                this.onStatusChange(status);
            }
        }
    }

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

    connect() {
        return this.getServerInfo().then((serverInfo) => {
            return new Promise((resolve, reject) => {
                const {config} = this;
                const {socketUrl} = config;
                const {token} = serverInfo;
                this.token = token;
                const onConnect = () => {
                    delete this.postData;
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
        })
    }

    handleSocketMessage(message) {

    }

    handSocketClose() {
        this.status = STATUS.CLOSED;
    }

    handleSocketError() {

    }

    sendMessage(message) {
        this.socket.send()
    }
}