import {remote} from 'electron';
import ui from './ui';
import Lang from '../../lang';

/**
 * Electron 上下文菜单类
 * @private
 */
const {Menu} = remote;

/**
 * 创建上下文菜单实例
 * @param {Object[]} menu 要创建的上下文菜单项清单
 * @return {Menu} 上下文菜单类
 */
export const createContextMenu = menu => {
    if (Array.isArray(menu) && !menu.popup) {
        menu = Menu.buildFromTemplate(menu);
    }
    return menu;
};

/**
 * 显示右键上下文菜单
 * @param {Menu|Object[]} menu 要创建的上下文菜单项清单或者上下文菜单实例
 * @param {number} x 菜单显示在 X 轴上的位置
 * @param {number} y 菜单显示在 Y 轴上的位置
 * @param {BrowserWindow} browserWindow 应用窗口实例
 * @return {void}
 */
export const popupContextMenu = (menu, x, y, browserWindow) => {
    if (typeof x === 'object') {
        y = x.clientY;
        x = x.clientX;
    }
    menu = createContextMenu(menu);
    menu.popup(browserWindow || ui.browserWindow, x, y);
};

/**
 * 文本选择右键菜单
 * @type {Menu}
 * @private
 */
const SELECT_MENU = [
    {role: 'copy', label: Lang.string('menu.copy')},
    {type: 'separator'},
    {role: 'selectall', label: Lang.string('menu.selectAll')}
];

/**
 * 文本输入框右键菜单
 * @type {Menu}
 * @private
 */
const INPUT_MENU = [
    {role: 'undo', label: Lang.string('menu.undo')},
    {role: 'redo', label: Lang.string('menu.redo')},
    {type: 'separator'},
    {role: 'cut', label: Lang.string('menu.cut')},
    {role: 'copy', label: Lang.string('menu.copy')},
    {role: 'paste', label: Lang.string('menu.paste')},
    {type: 'separator'},
    {role: 'selectall', label: Lang.string('menu.selectAll')}
];

/**
 * 显示文本输入框右键上下文菜单
 * @param {BrowserWindow} windowObj 应用窗口实例
 * @param {number} x 菜单显示在 X 轴上的位置
 * @param {number} y 菜单显示在 Y 轴上的位置
 * @return {void}
 */
export const showInputContextMenu = (windowObj, x, y) => {
    popupContextMenu(INPUT_MENU, x, y, windowObj);
};

/**
 * 显示选中的文本右键上下文菜单
 * @param {BrowserWindow} windowObj 应用窗口实例
 * @param {number} x 菜单显示在 X 轴上的位置
 * @param {number} y 菜单显示在 Y 轴上的位置
 * @return {void}
 */
export const showSelectionContextMenu = (windowObj, x, y) => {
    popupContextMenu(SELECT_MENU, x, y, windowObj);
};

export default {
    createContextMenu,
    popupContextMenu,
    showSelectionContextMenu,
    showInputContextMenu
};
