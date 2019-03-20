/* eslint-disable react/destructuring-assignment */
import {showChatCodeDialog} from './chats/chat-send-code-dialog';
import {showChatShareDialog} from './chats/chat-share-dialog';
import {registerCommand} from '../core/commander';
import {getChat} from '../core/im/im-chats';
import {getCurrentActiveChatGID} from '../core/im/im-ui';
import {showUpdateGuideDialog} from './common/update-guide-dialog';
import {showMessager} from '../components/messager';
import {showMemberProfileDialog} from './common/member-profile-dialog';
import {showWebviewDialog} from './common/webview-dialog';


export default () => {
    registerCommand('showChatSendCodeDialog', (context, chat) => {
        chat = chat || context.chat || getCurrentActiveChatGID(); // eslint-disable-line
        if (typeof chat === 'string') {
            chat = getChat(chat);
        }
        if (!chat) {
            return;
        }
        showChatCodeDialog(chat);
    });

    registerCommand('showChatShareDialog', (context) => {
        const {message} = context;
        showChatShareDialog(message);
    });

    registerCommand('showUpdateGuideDialog', (context, callback) => showUpdateGuideDialog(callback));

    registerCommand('showMessager', (context, message, callback) => showMessager(message, context.options, callback));

    // 注册打开成员资料对话框命令
    registerCommand('showMemberProfile', (context, member, callback) => showMemberProfileDialog(member || context.member || (context.options && context.options.memberId), callback));

    registerCommand('openWebviewDialog', (context, url, options, callback) => showWebviewDialog(url || context.url, options || context.options, callback));
};
