import LANG_ZH_CN from '../lang/zh-cn.json';
import {platformCall, platformAccess} from '../platform';
import {setStoreItem, getStoreItem} from '../utils/store';
import LangHelper from '../utils/lang-helper';
import events from './events';

/**
 * 语言变更事件名称
 * @type {string}
 * @private
 */
const LANG_CHANGE_EVENT = 'lang.change';

/**
 * 语言访问辅助对象
 * @type {LangHelper}
 */
const langHelper = new LangHelper();

/**
 * 额外的语言表对象
 * @private
 * @type {Map<String, String>}
 */
let extraLangData = null;

/**
 * 绑定语言变更事件
 * @param {function(String)} listener 事件回调函数
 * @return {Symbol} 使用 `Symbol` 存储的事件 ID，用于取消事件
 * @example
 * import {onLangChange} from './lang.js';
 * import {events} from './events';
 *
 * // 绑定语言变更事件
 * const langChangeHandler = onLangChange(newLang => {
 *     console.log('新语言名称为', newLang.name);
 * });
 *
 * // 取消事件绑定
 * events.off(langChangeHandler);
 */
export const onLangChange = listener => events.on(LANG_CHANGE_EVENT, listener);

/**
 * 获取所有语言清单
 * @return {Array<{name: String, label: String}>} 语言清单列表
 */
export const getAllLangList = () => {
    return extraLangData.ALL || [{name: 'zh-cn', label: '简体中文'}];
};

/**
 * 更改界面语言
 * @param {String} langName 界面语言名称
 * @param {boolean} [notifyPlatform=true] 是否通知平台变更语言
 * @return {void}
 */
export const loadLanguage = (langName, notifyPlatform = true) => {
    if (!langName) {
        return;
    }
    if (langName !== langHelper.name) {
        // 获取平台预设的语言数据对象
        // 该语言数据默认会从 lang/ 目录下加载对应的语言文件
        const platformLangData = (langName === 'zh-cn') ? LANG_ZH_CN : (platformCall('language.loadLangData', langName) || LANG_ZH_CN);

        // 合并语言数据对象
        const langData = Object.assign({}, platformLangData, extraLangData && extraLangData[langName]);

        // 变更语言
        langHelper.change(langName, langData);

        // 存储当前语言配置
        setStoreItem('LANG_NAME', langName);

        // 触发语言变更事件
        events.emit(LANG_CHANGE_EVENT, langHelper);

        if (notifyPlatform) {
            platformCall('language.handleLangChange', langName, langData);
        }
    }
};

/**
 * 初始化界面语言文本访问功能
 * @param {Map<String, String>} extraData 额外的语言表数据对象
 * @return {void}
 */
export const initLang = (extraData) => {
    // 设置额外的语言表数据对象
    extraLangData = extraData;

    // 获取默认语言名称
    const langName = platformCall('language.getPlatformLangName') || getStoreItem('LANG_NAME') || 'zh-cn';

    // 绑定处理平台请求语言变更的情况
    const setRequestChangeLangHandler = platformAccess('language.setRequestChangeLangHandler');
    if (setRequestChangeLangHandler) {
        setRequestChangeLangHandler((newLangName) => {
            loadLanguage(newLangName, false);
        });
    }

    // 加载语言
    loadLanguage(langName);
};

export default langHelper;
