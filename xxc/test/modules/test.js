import request from 'request';
import UUID from 'uuid/v4';
import Socket from './socket';
import {testLog, mainLog} from './log4';

export default class Test {
    constructor() {
        this.token = '';
        this.socket = {};
        this.timer = {};
        this.userIDMin = 0;
        this.userIDMax = 0;
        this.sendMessageInfo = [];
        this.loginInfo = [];
    }

    init(params, callback) {
        this.params = params;
        const postData = JSON.stringify(this.params.loginData);
        request({
            url: this.params.xxbUrl,
            method: 'POST',
            json: true,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            body: `data=${postData}`
        }, (error, response, body) => {
            if (error) console.log(error);
            if (!error && response.statusCode === 200) {
                this.token = body.token;
                testLog.info('获取xxb token 成功');
                callback();
            }
        });
    }

    login(callback) {
        this.userIDMin = this.params.onlineUser;
        this.userIDMax = this.params.loginUsers + this.params.onlineUser;
        this.params.onlineUser = this.userIDMax;
        let i = this.userIDMin;
        this.timer[i] = setInterval(() => {
            if (i === this.userIDMax) {
                clearInterval(this.timer[i]);
                this.timer[i] = null;
                return;
            }
            const onConnect = (socket) => {
                const currentUserName = this.params.userName + socket.options.index;
                socket.startLoginMS = new Date().getTime();
                socket.send({
                    lang: 'zh-cn',
                    method: 'login',
                    module: 'chat',
                    params: ['', currentUserName, this.params.password, 'online'],
                    rid: 'login',
                    v: this.params.v
                }, () => {
                    socket.onData = (data) => {
                        if (data && data.method === 'login') {
                            if (data.result === 'success' && data.data.account === currentUserName) {
                                const useTime = new Date().getTime() - socket.startLoginMS;
                                socket.userID = data.data.id;
                                this.loginInfo.push(useTime);
                                testLog.info(`<${currentUserName}>登录成功,登录用时${useTime} ms`);
                                if (this.loginInfo.length === this.params.loginUsers) {
                                    const count = this.loginInfo.reduce((prev, cur) => {return prev + cur;}, 0);
                                    const max = Math.max(...this.loginInfo);
                                    const min = Math.min(...this.loginInfo);
                                    const average = count / this.loginInfo.length;
                                    mainLog.info('---------登录信息统计----------');
                                    mainLog.info(`登录总耗时：${count / 1000} s`);
                                    mainLog.info(`登录最大耗时：${max / 1000} s`);
                                    mainLog.info(`登录最小耗时：${min / 1000} s`);
                                    mainLog.info(`登录平均耗时：${average / 1000} s`);
                                    mainLog.info('------------------------------');
                                }
                                clearInterval(this.timer[i]);
                                this.timer[i] = null;
                                callback(this.params.onlineUser, socket);
                            } else if (data.result === 'fail') {
                                testLog.info(`<${currentUserName}>登录失败`);
                            }
                        }
                    };
                });
            };
            this.socket[i] = new Socket(this.params.xxdUrl, {
                token: this.token,
                index: i,
                onConnect,
                sendMessageInterval: this.params.sendMessageIntervl
            });
            i++;
        }, 1000);
    }

    sendChatMessage(socket) {
        this.stopLoop = 0;
        socket.timer = setInterval(() => {
            const spaceTime = new Date().getTime() - socket.createTime;
            if (socket.messageOrder === this.params.loop || spaceTime > this.params.time) {
                this.stopLoop++;
                clearInterval(socket.timer);
                socket.timer = null;
                console.log(this.stopLoop)
                testLog.info(`${this.stopLoop}<loop stop>, 发送消息次数：${socket.messageOrder}, 发送时间：${spaceTime}`);
                if (this.stopLoop === this.params.loginUsers) {
                    const count = this.sendMessageInfo.reduce((prev, cur) => {return prev + cur;}, 0);
                    const max = Math.max(...this.sendMessageInfo);
                    const min = Math.min(...this.sendMessageInfo);
                    const average = count / this.sendMessageInfo.length;
                    mainLog.info('---------发送消息统计----------');
                    mainLog.info(`发送消息总耗时：${count / 1000} s`);
                    mainLog.info(`发送消息最大耗时：${max / 1000} s`);
                    mainLog.info(`发送消息最小耗时：${min / 1000} s`);
                    mainLog.info(`发送消息平均耗时：${average / 1000} s`);
                    mainLog.info('------------------------------');
                    console.log('程序执行完毕');
                }
                socket.close();
                return;
            }
            socket.messageOrder++;

            let chatUserID = this.randomNum(this.userIDMax);
            if (chatUserID === 0 || chatUserID === socket.userID) chatUserID = 1;
            const groupGid = this.params.groups ? this.params.groups[0] : '';
            // const cgid = groupGid ? chatUserID > this.userIDMax / 2 ? groupGid.gid : chatUserID + '&' + this.socket[socketI].userID : chatUserID + '&' + this.socket[socketI].userID;
            const cgid = chatUserID + '&' + socket.userID;
            socket.startChatT[socket.messageOrder] = new Date().getTime();
            socket.send({
                lang: 'zh-cn',
                method: 'message',
                module: 'chat',
                params: [[{
                    cgid,
                    content: this.params.content.substr(0, this.randomNum(this.params.content.length)),
                    contentType: 'plain',
                    date: '',
                    gid: UUID(),
                    type: 'normal',
                    user: socket.userID,
                    order: socket.messageOrder
                }]],
                userID: socket.userID,
                v: this.params.v
            }, () => {
                socket.onData = (data) => {
                    if (data && data.method === 'message' && data.data[0].user === socket.userID && data.result === 'success') {
                        const userTime = new Date().getTime() - socket.startChatT[data.data[0].order];
                        this.sendMessageInfo.push(userTime);
                        testLog.info(`<${this.params.userName + socket.options.index}>ID为${socket.userID}，发送第${(data.data[0].order)}条信息成功，发送给<${data.data[0].cgid}>, 发送延时${userTime} ms, 发送内容${data.data[0].content}`);
                    }
                };
            });
        }, socket.options.sendMessageInterval);
    }

    randomNum = max => {return Math.round(max * Math.random());}
}
