/** @module limit-time-promise */

/**
 * 创建一个限时 Promise
 *
 * @param {Promise} promise 要执行的 Promise
 * @param {number} [timeout=15000] 限时，单位毫秒
 * @param {string|Error} timeoutError 超时出错信息
 * @function
 */
export default (promise, timeout = 15000, timeoutError = 'TIMEOUT') => {
    const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(timeoutError);
        }, timeout);
    });

    return Promise.race([promise, timeoutPromise]);
};
