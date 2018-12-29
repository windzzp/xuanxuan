import React, {Component} from 'react';
import {rem} from '../../utils/html-helper';
import SearchControl from '../../components/search-control';
import Lang from '../../core/lang';
import GroupList from '../../components/group-list';
import App from '../../core';
import ChatShareList from './chat-share-list';
import _ChatListItem from './chat-list-item';
import Emojione from '../../components/emojione';
import withReplaceView from '../with-replace-view';

/**
 * ChatListItem 可替换组件形式
 * @type {Class<ChatListItem>}
 * @private
 */
const ChatListItem = withReplaceView(_ChatListItem);

export default class ChatShare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            choosed: {},
            search: '',
        };
    }

    /**
     * 处理列表条目点击事件
     *
     * @param {Chat} chat 聊天对象
     */
    onItemClick = chat => {
        const {choosed} = this.state;
        if (choosed[chat.gid]) {
            delete choosed[chat.gid];
        } else {
            choosed[chat.gid] = chat;
        }
        this.setState({choosed});
    }

    /**
     * 处理选中区点击事件
     */
    handleOnItemClick = e => {
        const chat = App.im.chats.get(e.currentTarget.attributes['data-gid'].value);
        this.onItemClick(chat);
    }

    /**
     * 处理转发点击事件
     */
    handleShareBtnClick = () => {
        const {message, onRequestClose} = this.props;
        const {choosed} = this.state;

        onRequestClose();
        Object.keys(choosed).map((key) => {
            const chat = choosed[key];
            message.content = Emojione.toShort(message.content);
            App.im.server.sendTextMessage(message.content, chat, message.contentType === 'text' ? true : null); // eslint-disable-line
        });
    }

    /**
     * 处理搜索框变更事件
     *
     * @param {string} search 搜索字符串
     * @private
     * @memberof ChatInvite
     * @return {void}
     */
    handleSearchChange = search => {
        this.setState({search});
    };

    /**
     * 检查列表条目是否为分组
     *
     * @param {Object} item 列表条目
     * @memberof MenuGroupList
     * @returns {boolean} 如果返回 `true` 则为是分组，否则为不是分组
     * @private
     */
    checkIsGroup = item => {
        return item.list && item.entityType !== 'Chat';
    };

    itemCreator = chat => {
        if (chat.gid === 'littlexx') return;
        return (
            <ChatListItem
                data-gid={chat.gid}
                key={chat.gid}
                chat={chat}
                onClick={this.handleOnItemClick}
                className="item"
                notUserLink="disabled"
            />
        );
    };

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof ChatShare
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {choosed, search} = this.state;
        const choosedItems = [];

        App.im.chats.forEach(chat => {
            if (choosed[chat.gid]) {
                choosedItems.push(chat);
            }
        });

        return (
            <div className="single row outline space app-chat-share">
                <div style={{width: rem(150)}}>
                    <div className="has-padding-sm flex-none darken">
                        <SearchControl onSearchChange={this.handleSearchChange} />
                    </div>
                    <div className="app-chat-share-menu">
                        <ChatShareList
                            onItemClick={this.onItemClick}
                            eventBindObject={this}
                            search={search}
                        />
                    </div>
                </div>
                <div className="cell column single flex-auto divider-left">
                    <div className="heading flex-none primary-pale">
                        <div className="title text-accent flex-auto">{Lang.string('chat.invite.choosed')} ({choosedItems.length})</div>
                        <div className="flex-none has-padding-h"><button type="button" disabled={!choosedItems.length} className="btn primary rounded btn-wide" onClick={this.handleShareBtnClick}>{Lang.string('chat.share')}</button></div>
                    </div>
                    <div className="app-chat-share-content">
                        <GroupList
                            group={{list: choosedItems, root: true}}
                            itemCreator={this.itemCreator}
                            checkIsGroup={this.checkIsGroup}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
