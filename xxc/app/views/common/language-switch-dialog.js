import React from 'react';
import Modal from '../../components/modal';
import LanguageSwitcher from './language-switcher';

/**
 * 显示快捷键设置对话框
 * @param {function} callback 对话框显示完成时的回调函数
 * @return {void}
 */
export const showLanguageSwitchDialog = (callback) => {
    return Modal.show({
        headingClassName: 'dock dock-right dock-top',
        content: <LanguageSwitcher />,
        actions: false
    }, callback);
};

export default {
    show: showLanguageSwitchDialog,
};
