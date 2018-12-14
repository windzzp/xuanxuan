import {createContextMenu, popupContextMenu} from './contextmenu';
import Lang from '../../lang';

/**
 * 文本选择右键菜单
 * @type {Menu}
 * @private
 */
const SELECT_MENU = createContextMenu([
    {role: 'copy', label: Lang.string('menu.copy')},
    {type: 'separator'},
    {role: 'selectall', label: Lang.string('menu.selectAll')}
]);

/**
 * 文本输入框右键菜单
 * @type {Menu}
 * @private
 */
const INPUT_MENU = createContextMenu([
    {role: 'undo', label: Lang.string('menu.undo')},
    {role: 'redo', label: Lang.string('menu.redo')},
    {type: 'separator'},
    {role: 'cut', label: Lang.string('menu.cut')},
    {role: 'copy', label: Lang.string('menu.copy')},
    {role: 'paste', label: Lang.string('menu.paste')},
    {type: 'separator'},
    {role: 'selectall', label: Lang.string('menu.selectAll')}
]);

/**
 * 初始化 WebView 上的右键菜单
 * @param {WebView} webview WebView 实例
 * @return {void}
 */
export const initWebview = (webview) => {
    if (!webview || !webview.getWebContents) {
        return;
    }
    const webContents = webview.getWebContents();
    if (webContents) {
        webContents.on('context-menu', (e, props) => {
            const {selectionText, isEditable} = props;
            if (isEditable) {
                popupContextMenu(INPUT_MENU, e.clientX, e.clientY);
            } else if (selectionText && selectionText.trim() !== '') {
                popupContextMenu(SELECT_MENU, e.clientX, e.clientY);
            }
        });
    }
};

export default {
    initWebview,
};
