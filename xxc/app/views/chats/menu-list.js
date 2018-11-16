import React, {Component} from 'react';
import PropTypes from 'prop-types';
import App from '../../core';
import {showContextMenu} from '../../core/context-menu';
import {MenuContactList} from './menu-contact-list';
import {MenuGroupList} from './menu-group-list';
import {MenuSearchList} from './menu-search-list';
import {MenuRecentList} from './menu-recent-list';
import replaceViews from '../replace-views';

/**
 * MenuList 组件 ，显示聊天列表界面
 * @class MenuList
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example
 * import MenuList from './menu-list';
 * <MenuList />
 */
export default class MenuList extends Component {
    /**
     * 获取 MenuList 组件的可替换类（使用可替换组件类使得扩展中的视图替换功能生效）
     * @type {Class<MenuList>}
     * @readonly
     * @static
     * @memberof MenuList
     * @example <caption>可替换组件类调用方式</caption>
     * import {MenuList} from './menu-list';
     * <MenuList />
     */
    static get MenuList() {
        return replaceViews('chats/menu-list', MenuList);
    }

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof MenuList
     * @type {Object}
     */
    static propTypes = {
        className: PropTypes.string,
        search: PropTypes.string,
        filter: PropTypes.string,
        children: PropTypes.any,
        onRequestClearSearch: PropTypes.func,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof MenuList
     * @static
     */
    static defaultProps = {
        className: null,
        search: null,
        filter: null,
        children: null,
        onRequestClearSearch: null,
    };

    /**
     * React 组件生命周期函数：`componentDidMount`
     * 在组件被装配后立即调用。初始化使得DOM节点应该进行到这里。若你需要从远端加载数据，这是一个适合实现网络请
    求的地方。在该方法里设置状态将会触发重渲。
     *
     * @see https://doc.react-china.org/docs/react-component.html#componentDidMount
     * @private
     * @memberof MenuList
     * @return {void}
     */
    componentDidMount() {
        this.dataChangeHandler = App.events.onDataChange(data => {
            let needForceUpdate = false;
            if (this.props.search) {
                needForceUpdate = true;
            } else if (this.props.filter === 'groups' && data.chats && Object.keys(data.chats).some(x => data.chats[x].isGroupOrSystem)) {
                needForceUpdate = true;
            } else if (this.props.filter === 'contacts' && ((data.chats && Object.keys(data.chats).some(x => data.chats[x].isOne2One)) || data.members)) {
                needForceUpdate = true;
            } else {
                needForceUpdate = true;
            }
            if (needForceUpdate) {
                this.forceUpdate();
            }
        });
    }

    /**
     * React 组件生命周期函数：`componentWillUnmount`
     * 在组件被卸载和销毁之前立刻调用。可以在该方法里处理任何必要的清理工作，例如解绑定时器，取消网络请求，清理
    任何在componentDidMount环节创建的DOM元素。
     *
     * @see https://doc.react-china.org/docs/react-component.html#componentwillunmount
     * @private
     * @memberof MenuList
     * @return {void}
     */
    componentWillUnmount() {
        App.events.off(this.dataChangeHandler);
    }

    /**
     * 处理聊天右键菜单事件
     * @param {Chat} chat 聊天对象
     * @param {Event} event 事件对象
     * @memberof MenuList
     * @private
     * @return {void}
     */
    handleItemContextMenu = (chat, event) => {
        showContextMenu('chat.menu', {
            event,
            chat,
            menuType: this.props.filter,
            viewType: this.props.filter === 'groups' ? 'category' : ''
        });
    };

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof MenuList
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            search,
            filter,
            onRequestClearSearch,
            className,
            children,
            ...other
        } = this.props;

        if (search) {
            return <MenuSearchList className={className} search={search} onRequestClearSearch={onRequestClearSearch} {...other} />;
        } else if (filter === 'contacts') {
            return <MenuContactList className={className} filter={filter} {...other} />;
        } else if (filter === 'groups') {
            return <MenuGroupList className={className} filter={filter} {...other} />;
        }
        return <MenuRecentList className={className} filter="recents" {...other} />;
    }
}
