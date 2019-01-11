import events from '../events';
import {socket} from '../server';
import profile, {getCurrentUser} from '../profile';

/**
 * 事件表
 * @type {Object<string, string>}
 * @private
 */
const EVENT = {
    chat_typing_change: 'chat.typing.change',
};

/**
 * 至少间隔多长时间向服务器更新状态，单位毫秒
 * @type {number}
 */
const msgSendInterval = 3000;

/**
 * 存储聊天输入框状态
 * @type {Object}
 */
const chatSendboxStatus = {};

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
 * @returns {Promise} 使用 Promise 异步返回处理结果
 */
export const sendChatTyping = (chat, typing) => {
    const theOtherMembersID = chat.getOtherMembersID(profile.userId);
    return socket.send({
        method: 'typing',
        params: [
            theOtherMembersID,
            chat.gid,
            typing
        ]
    });
};

/**
 * 更新聊天输入框输入状态
 * @param {Chat} chat 当前聊天对象
 * @param {boolean} hasContent 当前聊天输入框是否有内容
 * @return {void}
 */
export const updateChatSendboxStatus = (chat, hasContent) => {
    const user = getCurrentUser();
    if (!user || !user.isVersionSupport('chatTyping')) {
        // return;
    }

    const status = chatSendboxStatus[chat.gid] || {
        typingTime: 0,
    };
    if (status.delayTimer) {
        clearTimeout(status.delayTimer);
        status.delayTimer = null;
    }
    const now = new Date();

    const {typingTime} = status;
    if (hasContent) {
        // 如果还没更新过状态，或者上次更新状态是3秒之前
        if (!typingTime || (now - typingTime) > msgSendInterval) {
            sendChatTyping(chat, true);
            status.typingTime = now;
        }
        status.delayTimer = setTimeout(() => {
            sendChatTyping(chat, false);
            status.typingTime = 0;
            status.delayTimer = null;
        }, 1000);
    } else if (typingTime && (now - typingTime) > msgSendInterval) {
        sendChatTyping(chat, false);
        status.typingTime = 0;
    }
    chatSendboxStatus[chat.gid] = status;
};
