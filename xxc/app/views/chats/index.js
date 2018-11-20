import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Config from '../../config';
import {Route, Redirect} from 'react-router-dom';
import SplitPane from 'react-split-pane';
import {classes} from '../../utils/html-helper';
import App from '../../core';
import {Menu} from './menu';
import {ChatsCache} from './chats-cache';
import {ChatsDndContainer} from './chats-dnd-container';
import {ChatsSuggestPanel} from './chats-suggest-panel';
import replaceViews from '../replace-views';

/**
 * ChatsIndex 组件 ，显示聊天主界面
 * @class ChatsIndex
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example
 * import ChatsIndex from './index';
 * <ChatsIndex />
 */
export default class ChatsIndex extends Component {
    /**
     * 获取 ChatsIndex 组件的可替换类（使用可替换组件类使得扩展中的视图替换功能生效）
     * @type {Class<ChatsIndex>}
     * @readonly
     * @static
     * @memberof ChatsIndex
     * @example <caption>可替换组件类调用方式</caption>
     * import {ChatsIndex} from './index';
     * <ChatsIndex />
     */
    static get ChatsIndex() {
        return replaceViews('chats/index', ChatsIndex);
    }

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof ChatsIndex
     * @type {Object}
     */
    static propTypes = {
        match: PropTypes.object.isRequired,
        hidden: PropTypes.bool,
        className: PropTypes.string,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof ChatsIndex
     * @static
     */
    static defaultProps = {
        hidden: false,
        className: null,
    };

    /**
     * 处理聊天缓存界面点击点击事件
     * @memberof ChatsIndex
     * @private
     * @return {void}
     */
    handChatsCacheClick = () => {
        App.ui.showMobileChatsMenu(false);
    };

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof ChatsIndex
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            hidden,
            className,
            match
        } = this.props;

        App.im.ui.activeChat(match.params.id);

        return (<div className={classes('dock app-chats', className, {hidden})}>
            <SplitPane split="vertical" maxSize={400} minSize={200} defaultSize={200} paneStyle={{userSelect: 'none'}}>
                <Menu className="dock" filter={match.params.filterType} />
                <ChatsCache onClick={this.handChatsCacheClick} className="dock" filterType={match.params.filterType} chatId={match.params.id}>
                    <ChatsDndContainer className="dock" />
                </ChatsCache>
            </SplitPane>
            <Route
                path="/chats/:filterType"
                exact
                render={props => {
                    const activeChatId = App.im.ui.currentActiveChatId;
                    if (activeChatId) {
                        return <Redirect to={`${props.match.url}/${activeChatId}`} />;
                    }
                    return null;
                }}
            />
            <ChatsSuggestPanel />
        </div>);
    }
}
