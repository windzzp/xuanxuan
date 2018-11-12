import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {classes, getSearchParam} from '../../utils/html-helper';
import {MenuHeader} from './menu-header';
import {MenuList} from './menu-list';
import replaceViews from '../replace-views';

/**
 * Menu 组件 ，显示聊天列表界面
 * @class Menu
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example @lang jsx
 * import Menu from './menu';
 * <Menu />
 */
export default class Menu extends Component {
    /**
     * 获取 Menu 组件的可替换类（使用可替换组件类使得扩展中的视图替换功能生效）
     * @type {Class<Menu>}
     * @readonly
     * @static
     * @memberof Menu
     * @example <caption>可替换组件类调用方式</caption> @lang jsx
     * import {Menu} from './menu';
     * <Menu />
     */
    static get Menu() {
        return replaceViews('chats/menu', Menu);
    }

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof Menu
     * @type {Object}
     */
    static propTypes = {
        className: PropTypes.string,
        filter: PropTypes.string,
        children: PropTypes.any,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof Menu
     * @static
     */
    static defaultProps = {
        className: null,
        filter: null,
        children: null,
    };

    /**
     * React 组件构造函数，创建一个 Menu 组件实例，会在装配之前被调用。
     * @see https://react.docschina.org/docs/react-component.html#constructor
     * @param {Object?} props 组件属性对象
     * @constructor
     */
    constructor(props) {
        super(props);

        /**
         * 默认搜索字符串
         * @type {string}
         * @private
         */
        this.defaultSearch = getSearchParam('search');

        /**
         * React 组件状态对象
         * @see https://react.docschina.org/docs/state-and-lifecycle.html
         * @type {object}
         */
        this.state = {
            search: this.defaultSearch,
            searchFocus: false
        };
    }

    /**
     * 处理搜索字符串变更事件
     * @param {string} search 搜索字符串
     * @memberof Menu
     * @private
     * @return {void}
     */
    handleSearchChange = search => {
        this.setState({search});
    };

    /**
     * 处理搜索框获得焦点事件
     * @param {boolean} searchFocus 搜索框是否获得焦点
     * @memberof Menu
     * @private
     * @return {void}
     */
    handleSearchFocusChange = searchFocus => {
        if (this.blurSearchTimer) {
            clearTimeout(this.blurSearchTimer);
        }
        if (searchFocus) {
            this.setState({searchFocus});
        } else {
            this.blurSearchTimer = setTimeout(() => {
                this.setState({searchFocus: false});
                this.blurSearchTimer = null;
            }, 200);
        }
    };

    /**
     * 处理请求清空搜索框事件
     *
     * @memberof Menu
     * @return {void}
     */
    onRequestClearSearch = () => {
        this.menuHeader.clearSearch();
    };

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof Menu
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            filter,
            className,
            children,
            ...other
        } = this.props;

        return (<div className={classes('app-chats-menu primary-pale', className)} {...other}>
            <MenuHeader
                ref={e => {this.menuHeader = e;}}
                filter={filter}
                defaultSearch={this.defaultSearch}
                onSearchChange={this.handleSearchChange}
                onSearchFocus={this.handleSearchFocusChange}
                className="dock-top"
            />
            <MenuList onRequestClearSearch={this.onRequestClearSearch} search={this.state.searchFocus ? this.state.search : ''} filter={filter} className="dock-bottom" />
            {children}
        </div>);
    }
}
