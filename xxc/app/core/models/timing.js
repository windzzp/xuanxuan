
import App from '../index';
import events from '../events';

/**
 * 定时任务循环的时间间隔，单位毫秒
 * @type {number}
 * @private
 */
const LOOP_TIME = 1000 * 60 * 30;

/**
 * 定时任务ID
 * @type {Number}
 * @private
 */
let loopTime = null;

/**
 * 多久未激活的DOM需要清理，单位毫秒
 * @type {number}
 * @private
 */
const CLEAR_DOM_TIME = 1000 * 60 * 10;

/**
 * 被激活聊天的信息
 * @type {Array}
 * @private
 */
const activeInfo = [];

/**
 * 收集信息的类型
 * @type {Object}
 * @private
 */
const INFO_TYPE = {
    lastActiveDate: 'lastActiveDate',
    content: 'content',
};

/**
 * 事件表
 * @type {Object<string, string>}
 * @private
 */
const EVENT = {
    updateChatView: 'im.chats.updateChatView',
};

/**
 * 监听更新聊天窗口事件（用来更新聊天窗口）
 * @param {Function(chats: Array<ChatMessage>)} listener 事件回调函数
 * @return {Symbol}
 */
export const updateChatView = listener => events.on(EVENT.updateChatView, listener);

/**
 * 将聊天窗信息存到infoBox中
 * @param {string} type 用来将信息存到不同的type中。lastAcativeDate
 * @param {object} info {cgid: , data: } 相同cgid内容会被替换,这里都要统一使用变量名cgid
 * @return {void}
 */
export const setInfo = (type, info) => {
    if (typeof activeInfo[type] === 'undefined') activeInfo[type] = [];
    if (activeInfo[type].length > 0) {
        for (let i = 0; i < activeInfo[type].length; i++) {
            if (activeInfo[type][i].cgid === info.cgid) {
                activeInfo[type][i] = info;
                break;
            }
            if (activeInfo[type][i].cgid !== info.cgid && (activeInfo[type].length - 1) === i) activeInfo[type].push(info);
        }
    } else {
        activeInfo[type].push(info);
    }
};

/**
 * 获取聊天窗信息
 * @param {string} type 信息的类型
 * @param {string} cgid CGID
 * @return {void}
 */
export const getInfo = (type, cgid) => {
    if (typeof activeInfo[type] === 'undefined') return false;
    if (activeInfo[type].length > 0) {
        return activeInfo[type].filter(data => data.cgid === cgid);
    }
    return false;
};

/**
 * 循环任务
 * @return {void}
 */
export const timingStart = () => {
    createViewloop();
};

/**
 * 循环任务清理聊天窗口循环体
 * @return {void}
 */
export const createViewloop = () => {
    loopTime = setTimeout(() => {
        const nowDate = new Date().getTime();
        if (activeInfo && activeInfo[INFO_TYPE.lastActiveDate]) {
            const claerChats = activeInfo[INFO_TYPE.lastActiveDate].filter((chat) => nowDate - chat.content >= CLEAR_DOM_TIME);
            App.im.ui.deleteActiveChat(claerChats);
        }
        loopTime = null;
        createViewloop();
    }, LOOP_TIME);
};

export default {
    setInfo,
    getInfo,
    timingStart,
    updateChatView,
};
