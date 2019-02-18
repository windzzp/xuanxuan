import React from 'react';
import Modal from '../../components/modal';
import _UpdateGuide from './update-guide';
import withReplaceView from '../with-replace-view';

/**
 * UserAvatar 可替换组件形式
 * @type {Class<ChatCreateView>}
 * @private
 */
const UpdateGuide = withReplaceView(_UpdateGuide);

/**
 * 显示创建聊天对话框
 * @param {function} callback 显示完成后的回调函数
 * @return {void}
 */
export const showUpdateGuideDialog = (callback) => {
    const modalId = 'app-update-guide-dialog';
    return Modal.show({
        id: modalId,
        actions: false,
        closeButton: false,
        modal: true,
        content: <UpdateGuide onRequestClose={() => (Modal.hide(modalId))} />
    }, callback);
};

export default {
    show: showUpdateGuideDialog,
};
