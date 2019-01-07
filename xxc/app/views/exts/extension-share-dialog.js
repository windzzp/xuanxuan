import React from 'react';
import Modal from '../../components/modal';
import ChatShare from '../chats/chat-share';
import Lang from '../../core/lang';

/**
 * 显示扩展分享对话框
 * @param {Extension} extension 要显示的扩展对象
 * @param {function} callback 对话框显示完成回调函数
 * @return {void}
 */
export const showExtensionShareDialog = (extension, callback) => {
    const modalId = 'app-ext-share-dialog';
    const message = {
        _entityType: 'AppUrl',
        url: extension.app._webViewUrl,
    };
    return Modal.show({
        id: modalId,
        title: Lang.string('chat.share'),
        className: 'app-ext-share-dialog ',
        animation: 'enter-from-top',
        actions: false,
        content: <ChatShare message={message} onRequestClose={() => (Modal.hide(modalId))} />,
    }, callback);
};

export default {
    show: showExtensionShareDialog,
};
