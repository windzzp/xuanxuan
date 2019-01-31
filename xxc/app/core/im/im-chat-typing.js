import events from '../events';
import {socket} from '../server';
import profile, {getCurrentUser} from '../profile';
import members from '../members';

/**
 * 事件表
 * @type {Object<string, string>}
 * @private
 */
const EVENT = {
    chat_typing_change: 'chat.typing.change',
};

/**
 * 用于方便获取用户信息的对象
 * @type {Object}
 * @private
 */
const app = {
    members,
    get user() {
        return profile.user;
    }
};

/**
 * 至少间隔多长时间向服务器更新状态，单位毫秒
 * @type {number}
 */
export const msgSendInterval = 3000;

/**
 * 存储聊天输入框状态
 * @type {Object}
 * @private
 */
const lastTypingTimes = {};

/**
 * 记录当前是否在发送状态数据包
 * @type {boolean}
 * @private
 */
let isSendingTyping = false;

/**
 * 通知界面聊天输入状态变更
 * @param {String} cgid 聊天的 GID 属性
 * @param {boolean} typing 如果为 `true` 表示用户正在输入，如果为 `false` 表示用户停止输入
 * @param {String|number} typeUserID 表示输入状态变更的用户 ID
 * @return {void}
 */
export const updateChatTyping = (cgid, typing, typeUserID) => {
    events.emit(`${EVENT.chat_typing_change}.${cgid}`, typing, typeUserID);
};

/**
 * 绑定聊天用户输入状态变更事件
 * @param {String} cgid 聊天的 GID 属性
 * @param {funcion} listener 事件回调函数
 * @return {Symbol} 使用 `Symbol` 存储的事件 ID，用于取消事件
 */
export const onChatTypingChange = (cgid, listener) => {
    return events.on(`${EVENT.chat_typing_change}.${cgid}`, listener);
};

/**
 * 向服务器发送当前用户输入状态变更信息
 * @param {Chat} chat 当前聊天对象
 * @param {boolean} typing 如果为 `true` 表示用户正在输入，如果为 `false` 表示用户停止输入
 * @returns {void}
 */
export const sendChatTyping = (chat, typing) => {
    const theOtherMembersID = chat.getOtherMembersID(profile.userId);
    isSendingTyping = true;
    return socket.send({
        method: 'typing',
        params: [
            theOtherMembersID,
            chat.gid,
            typing
        ]
    }).then(msg => {
        isSendingTyping = false;
        return Promise.resolve(msg);
    });
};

/**
 * 更新聊天输入框输入状态
 * @param {Chat} chat 当前聊天对象
 * @param {boolean} hasContent 当前聊天输入框是否有内容
 * @return {void}
 */
export const updateChatSendboxStatus = (chat, hasContent) => {
    // 如果聊天对方不在线，则不发送输入状态
    if (!chat.isOnline(app)) {
        return;
    }

    // 如果上一个输入状态还没发出去，则取消此次状态更新
    if (isSendingTyping) {
        return;
    }

    // 如果用户没有登录或者版本不支持或者用户禁用了这个功能，则不发送输入状态
    const user = getCurrentUser();
    if (!user || !user.isVersionSupport('chatTyping') || !user.config.sendTypingStatus) {
        return;
    }

    // 获取上次发送状态时的时间
    const {gid} = chat;
    const typingTime = lastTypingTimes[gid];
    const now = new Date();

    // 如果还没更新过状态，或者上次更新状态是 3 秒之前
    if ((!typingTime && hasContent) || (now - typingTime) >= msgSendInterval) {
        sendChatTyping(chat, true);
        lastTypingTimes[gid] = now;
    }
};
