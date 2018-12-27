import ExtsRuntime from 'ExtsRuntime';
import events from './events';
import {initLang} from './lang';
import config from '../config';

/**
 * 运行时事件表
 * @type {Object<string, string>}
 * @private
 */
const EVENT = {
    ready: 'runtime.ready',
};

/**
 * 应用是否准备就绪（所有扩展加载完毕）
 * @type {boolean}
 * @private
 */
let isReadied = false;

/**
 * 绑定应用准备就绪事件
 * @param {Function} listener 事件回调函数
 * @return {boolean|Symbol} 如果应用已经准备就绪会立即执行回调函数并返回 `false`，否则会返回一个事件 ID
 */
export const ready = (listener) => {
    if (isReadied) {
        listener();
        return false;
    }
    return events.once(EVENT.ready, listener);
};

/**
 * 触发界面准备就绪事件
 * @private
 * @return {void}
 */
const sayReady = () => {
    isReadied = true;
    events.emit(EVENT.ready);
};

// 初始化应用
setTimeout(() => {
    initLang(config.lang);
    if (ExtsRuntime) {
        ExtsRuntime.loadModules();
        global.ExtsRuntime = ExtsRuntime;
    }
    sayReady();
}, 0);

export default {ready};
