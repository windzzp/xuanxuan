import React from 'react';
import _ChatListItem from './chat-list-item';
import GroupList from '../../components/group-list';
import App from '../../core';
import withReplaceView from '../with-replace-view';
import Lang from '../../core/lang';
import PropTypes from 'prop-types';

/**
 * ChatListItem 可替换组件形式
 * @type {Class<ChatListItem>}
 * @private
 */
const ChatListItem = withReplaceView(_ChatListItem);
export default class ChatShareList extends React.Component {
    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof ChatShareList
     * @type {Object}
     */
    static propTypes = {
        onItemClick: PropTypes.func,
        eventBindObject: PropTypes.object,
        search: PropTypes.string,
    }

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof ChatShareList
     * @static
     */
    static defaultProps = {
        onItemClick: null,
        eventBindObject: null,
        search: '',
    }

    /**
     * React 组件构造函数，创建一个 ChatShareList 组件实例，会在装配之前被调用。
     * @see https://react.docschina.org/docs/react-component.html#constructor
     * @param {Object?} props 组件属性对象
     * @constructor
     */
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * 处理列表条目点击事件
     * @memberof MemberList
     * @param {Event} e 事件对象
     * @private
     * @return {void}
     */
    handleOnItemClick = e => {
        const {onItemClick, eventBindObject} = this.props;
        if (onItemClick) {
            const chat = App.im.chats.get(e.currentTarget.attributes['data-gid'].value);
            onItemClick.call(eventBindObject, chat, e);
        }
    };

    /**
     * 渲染联系人聊天条目
     *
     * @param {Chat} chat 聊天对象
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     * @private
     * @memberof MenuContactList
     */
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

    /**
     * 处理分组展开折叠变更事件
     * @param {boolean} expanded 是否展开
     * @param {Object} group 分组信息
     * @memberof MenuContactList
     * @private
     * @return {void}
     */
    onExpandChange = (expanded, group) => {
        App.profile.userConfig.setChatMenuGroupState('contacts', this.groupType, group.id, expanded);
    };

    render() {
        const groupType = 'dept';
        const {search} = this.props;
        const shareList = [
            {id: 'contacts', title: Lang.string('chat.share.contacts'), list: App.im.chats.getContactsChats()},
            {id: 'group', title: Lang.string('chat.share.groups'), list: App.im.chats.getGroups()},
            {id: 'recent', title: Lang.string('chat.share.chats'), list: App.im.chats.getRecents()},
        ];
        let activeGroupList = '';
        const searchChats = App.im.chats.search(search);

        if(search === '') {
            activeGroupList = (
                <div className="flex-auto compact group-list">
                    <GroupList
                        group={shareList[0]}
                        defaultExpand={false}
                        itemCreator={this.itemCreator}
                        onExpandChange={this.onExpandChange}
                        hideEmptyGroup={groupType !== 'category'}
                    />
                    <GroupList
                        group={shareList[1]}
                        defaultExpand={false}
                        itemCreator={this.itemCreator}
                        checkIsGroup={this.checkIsGroup}
                        onExpandChange={this.onExpandChange}
                    />
                    <GroupList
                        group={shareList[2]}
                        itemCreator={this.itemCreator}
                        onExpandChange={this.onExpandChange}
                        checkIsGroup={this.checkIsGroup}
                    />
                </div>
            );
        }else{
            activeGroupList = (
                <div className="flex-auto compact group-list">
                    <GroupList
                        group={{list: searchChats, root: true}}
                        itemCreator={this.itemCreator}
                        checkIsGroup={this.checkIsGroup}
                    />
                </div>
            );
        }
        return activeGroupList;
    }
}
