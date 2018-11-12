import LANG_ZH_CN from './zh-cn.json';
import {formatString} from '../utils/string-helper';

/**
 * 默认语言代号
 * @type {string}
 * @private
 */
const DEFAULT_LANG = 'zh-cn';

/**
 * 当前语言代号
 * @type {string}
 */
export const currentLangName = DEFAULT_LANG;

/**
 * 语言表对象
 * @private
 * @type {Object<string, string>}
 */
let langData = Object.assign({}, LANG_ZH_CN);

/**
 * 更新语言表
 * @param {Object<string, string>} newLangData 新的语言表
 * @return {void}
 */
export const updateLangData = (newLangData) => {
    langData = Object.assign(langData, newLangData);
};

/**
 * 根据语言配置名称获取语言文本
 * @param  {string} name 语言配置名称
 * @param  {string} defaultValue 默认语言文本，如果没有在语言表中找到语言文本则返回此值
 * @return {string} 语言文本
 */
export const langString = (name, defaultValue) => {
    const value = langData[name];
    return value === undefined ? defaultValue : value;
};

/**
 * 获取使用参数格式化的语言文本
 *
 * @param {string} name 语言配置名称
 * @param {...any} args 格式化参数
 * @return {string} 语言文本
 */
export const langFormat = (name, ...args) => {
    const str = langString(name);
    if (args && args.length) {
        try {
            return formatString(str, ...args);
        } catch (e) {
            throw new Error(`Cannot format lang string with key '${name}', the lang string is '${str}'.`);
        }
    }
    return str;
};

/**
 * 获取错误信息对应的语言文本
 *
 * @param {string|Error} err 错误信息或错误对象本身
 * @return {string}
 */
export const langError = err => {
    if (typeof err === 'string') {
        return langString(`error.${err}`, err);
    }
    let message = '';
    if (err.code) {
        message += langString(`error.${err.code}`, `[Code: ${err.code}]`);
    }
    if (err.message && err.message !== err.code) {
        message += '(' + langString(`error.${err.message}`, err.message) + ')';
    }
    if (err.formats) {
        if (!Array.isArray(err.formats)) {
            err.formats = [err.formats];
        }
        message = formatString(message, ...err.formats);
    }
    if (DEBUG) {
        console.collapse('LANG.error', 'redBg', message, 'redPale');
        console.error(err);
        console.groupEnd();
    }
    return message;
};

export default {
    update: updateLangData,
    format: langFormat,
    string: langString,
    error: langError,

    get data() {
        return langData;
    },

    get name() {
        return currentLangName;
    }
};
