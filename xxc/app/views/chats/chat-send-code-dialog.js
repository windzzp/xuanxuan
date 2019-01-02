import React from 'react';
import Modal from '../../components/modal';
<<<<<<< HEAD:xxc/app/views/chats/chat-code-dialog.js
import ChatCode from './chat-code';
import Lang from '../../core/lang';
import { isAbsolute } from 'path';
import LangHelper from '../../utils/lang-helper';
=======
import ChatCode from './chat-send-code';
import Lang from '../../core/lang';

>>>>>>> 79ea1ca634c397b97b1c7f645b1d6b8fb74c3f6a:xxc/app/views/chats/chat-send-code-dialog.js
/**
 * 显示发送代码对话框界面
 * @param {Chat} chat 聊天对象
 * @param {function} callback 回调函数
 * @return {void}
 */
export const showChatCodeDialog = (chat, callback) => {
    const modalId = 'app-chat-code-dialog';
    let chatCode = '';
    return Modal.show({
        id: modalId,
        title: Lang.string('chat.sendCodeDialog.title'),
        style: {
            width: 600,
            height: 430,
            left: '50%',
            marginLeft: -300,
            position: 'absolute',
            bottom: 0,
        },
        className: 'app-chat-code-dialog',
        animation: 'enter-from-bottom',
        actions: [
            {
                type: 'submit',
                label: Lang.string('chat.sendbox.toolbar.code'),
                click: () => {
                    chatCode.handleSubmitBtnClick();
                }
            },
            {
                type: 'cancel',
            }
        ],
        content: <ChatCode ref={e => {chatCode = e;}} chat={chat} onRequestClose={() => (Modal.hide(modalId))} />
    }, callback);
};

export default {
    show: showChatCodeDialog,
};
