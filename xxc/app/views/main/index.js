import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Route, Redirect} from 'react-router-dom';
import {classes} from '../../utils/html-helper';
import ROUTES from '../common/routes';
import App from '../../core';
import {Navbar} from './navbar';
import {GlobalMessage} from './global-message';
import {CacheContainer} from './cache-container';
import replaceViews from '../replace-views';

/**
 * Index 组件 ，显示主界面
 * @class Index
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example
 * import Index from './index';
 * <Index />
 */
export default class MainIndex extends Component {
    /**
     * 获取 Index 组件的可替换类（使用可替换组件类使得扩展中的视图替换功能生效）
     * @type {Class<Index>}
     * @readonly
     * @static
     * @memberof Index
     * @example <caption>可替换组件类调用方式</caption>
     * import {Index} from './index';
     * <Index />
     */
    static get MainIndex() {
        return replaceViews('main/index', MainIndex);
    }

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof Index
     * @type {Object}
     */
    static propTypes = {
        className: PropTypes.string,
        userStatus: PropTypes.any,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof Index
     * @static
     */
    static defaultProps = {
        className: null,
        userStatus: null,
    };

    /**
     * React 组件生命周期函数：`componentDidMount`
     * 在组件被装配后立即调用。初始化使得DOM节点应该进行到这里。若你需要从远端加载数据，这是一个适合实现网络请
    求的地方。在该方法里设置状态将会触发重渲。
     *
     * @see https://doc.react-china.org/docs/react-component.html#componentDidMount
     * @private
     * @memberof Index
     * @return {void}
     */
    componentDidMount() {
        this.onUserConfigChange = App.profile.onUserConfigChange(() => {
            this.forceUpdate();
        });
    }

    /**
     * React 组件生命周期函数：`componentWillUnmount`
     * 在组件被卸载和销毁之前立刻调用。可以在该方法里处理任何必要的清理工作，例如解绑定时器，取消网络请求，清理
    任何在componentDidMount环节创建的DOM元素。
     *
     * @see https://doc.react-china.org/docs/react-component.html#componentwillunmount
     * @private
     * @memberof Index
     * @return {void}
     */
    componentWillUnmount() {
        App.events.off(this.onUserConfigChange);
    }

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof Index
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            className,
            userStatus,
            ...other
        } = this.props;

        return (<div className={classes('app-main', className)} {...other}>
            <GlobalMessage className="dock-top" />
            <Navbar userStatus={userStatus} className="dock-left primary shadow-2" />
            <Route path={ROUTES.apps.__} exact component={CacheContainer} />
            <Route
                path="/:app?"
                exact
                render={(props) => {
                    if (props.match.url === '/' || props.match.url === '/index' || props.match.url === '/chats') {
                        const activeChatId = App.im.ui.currentActiveChatId;
                        if (activeChatId) {
                            return <Redirect to={`/chats/recents/${activeChatId}`} />;
                        }
                        return <Redirect to="/chats/recents" />;
                    }
                    return null;
                }}
            />
        </div>);
    }
}
