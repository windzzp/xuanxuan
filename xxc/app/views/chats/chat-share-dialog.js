import React from 'react';
import Modal from '../../components/modal';
import ChatShare from './chat-share';
import Lang from '../../lang';

/**
 * 显示聊天历史记录对话框界面
 * @param {Chat} chat 聊天对象
 * @param {function} callback 回调函数
 * @return {void}
 */
export const showShareDialog = (message, callback) => {
    const modalId = 'app-chat-share-dialog';
    return Modal.show({
        id: modalId,
        title: Lang.string('chat.share'),
        className: 'app-chat-share-dialog',
        actions: false,
        content: <ChatShare message={message} onRequestClose={() => (Modal.hide(modalId))} />,
    }, callback);
};

export default {
    show: showShareDialog,
};
