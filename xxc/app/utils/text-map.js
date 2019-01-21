import {formatString} from './string-helper';

/**
 * 文本表类
 */
export default class TextMap {
    /**
     * 创建一个文本表类实例
     * @param {Map<String, String>} data 数据类型
     * @memberof TextMap
     */
    constructor(data) {
        this._data = Object.assign({}, data);
    }

    /**
     * 获取数据对象
     * @memberof TextMap
     * @type {Map<String, String>}
     * @readonly
     */
    get data() {
        return Object.assign({}, this._data);
    }

    /**
     * 获取使用参数格式化的文本
     *
     * @param {string} name 配置名称
     * @param {...any} args 格式化参数
     * @return {string} 文本
     */
    format(name, ...args) {
        const str = this.string(name);
        if (args && args.length) {
            try {
                return formatString(str, ...args);
            } catch (e) {
                throw new Error(`Cannot format lang string with key '${name}', the lang string is '${str}'.`);
            }
        }
        return str;
    }

    /**
     * 根据配置名称获取文本
     * @param  {string} name 配置名称
     * @param  {string} defaultValue 默认文本，如果没有在找到文本则返回此值
     * @return {string} 文本
     */
    string(name, defaultValue) {
        const value = this._data[name];
        return value === undefined ? defaultValue : value;
    }
}
