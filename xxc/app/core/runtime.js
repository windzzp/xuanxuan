import ExtsRuntime from 'ExtsRuntime';
import events from './events';

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
let isReadyed = false;

/**
 * 绑定应用准备就绪事件
 * @param {Function} listener 事件回调函数
 * @return {boolean|Symbol} 如果应用已经准备就绪会立即执行回调函数并返回 `false`，否则会返回一个事件 ID
 */
export const ready = (listener) => {
    if (isReadyed) {
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
    isReadyed = true;
    events.emit(EVENT.ready);
};

if (ExtsRuntime) {
    setTimeout(() => {
        ExtsRuntime.loadModules();
        sayReady();
    }, 0);
    global.ExtsRuntime = ExtsRuntime;
} else {
    sayReady();
}

export default {ready};
