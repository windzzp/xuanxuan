import React from 'react';
import Config from '../../config';
import Popover from '../../components/popover';
import Icon from '../../components/icon';
import profile from '../../core/profile';

/**
 * 显示聊天功能提示面板
 * @param {{x: number, y: number}} position 提示面板显示位置
 * @param {function} callback 回调函数
 * @return {void}
 */
export const showChatTipPopoer = (position, callback) => {
    const popoverId = 'app-chat-tip-popover';
    const onRequestClose = () => {
        Popover.hide(popoverId);
    };
    const content = (
        <div>
            <div className="heading">
                <div className="title strong">消息框小技巧</div>
                <nav className="nav">
                    <a
                        className="text-gray small"
                        onClick={() => {
                            profile.userConfig.showMessageTip = false;
                            onRequestClose();
                        }}
                    ><Icon name="close" /> 关闭并不再提示</a>
                </nav>
            </div>
            <div className="box">
                <ul style={{paddingLeft: 20, marginBottom: 0}}>
                    <li>拖拽图片和文件到消息框来发送；</li>
                    <li>使用 Markdown 语法来发送富文本；</li>
                    <li>你可以直接粘贴剪切板中的图片进行发送；</li>
                    {Config.system.screenCaptureDisabled ? null : <li>从截图按钮右键菜单上使用截图高级功能。</li>}
                </ul>
            </div>
        </div>
    );
    return Popover.show(position, content, {id: popoverId, width: 320, height: 140}, callback);
};

export default {
    show: showChatTipPopoer,
};
