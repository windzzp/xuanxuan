import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import HTML from '../utils/html-helper';
import TabPane from './tab-pane';

export default class Tabs extends PureComponent {
    /**
     * 标签页面板组件
     * @type {TabPane}
     * @static
     * @memberof Tabs
     */
    static TabPane = TabPane;

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof Tabs
     * @return {Object}
     */
    static propTypes = {
        navClassName: PropTypes.string,
        activeClassName: PropTypes.string,
        tabPaneClass: PropTypes.string,
        contentClassName: PropTypes.string,
        className: PropTypes.string,
        children: PropTypes.any,
        cache: PropTypes.bool,
        defaultActivePaneKey: PropTypes.any,
        onPaneChange: PropTypes.func,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof Tabs
     * @static
     */
    static defaultProps = {
        navClassName: '',
        activeClassName: 'active',
        contentClassName: 'active',
        tabPaneClass: '',
        className: '',
        cache: false,
        defaultActivePaneKey: null,
        onPaneChange: null,
        children: null,
    };

    /**
     * React 组件构造函数，创建一个 Tabs 组件实例，会在装配之前被调用。
     * @see https://react.docschina.org/docs/react-component.html#constructor
     * @param {Object?} props 组件属性对象
     * @constructor
     */
    constructor(props) {
        super(props);

        /**
         * React 组件状态对象
         * @see https://react.docschina.org/docs/state-and-lifecycle.html
         * @type {object}
         */
        this.state = {
            activePaneKey: this.props.defaultActivePaneKey
        };
    }

    /**
     * 处理导航变更事件
     * @param {String} key 变更后的当前标签页 Key 值
     * @memberof Tabs
     * @private
     * @return {void}
     */
    handleNavClick(key) {
        if (key !== this.state.activePaneKey) {
            const oldKey = this.state.activePaneKey;
            this.setState({activePaneKey: key}, () => {
                if (this.props.onPaneChange) {
                    this.props.onPaneChange(key, oldKey);
                }
            });
        }
    }

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof Tabs
     * @return {ReactNode}
     */
    render() {
        let {
            defaultActivePaneKey,
            cache,
            navClassName,
            tabPaneClass,
            activeClassName,
            contentClassName,
            onPaneChange,
            className,
            children,
            ...other
        } = this.props;

        if (!Array.isArray(children)) {
            children = [children];
        }

        return (<div className={HTML.classes('tabs', className)} {...other}>
            <nav className={HTML.classes('nav', navClassName)}>
                {
                    children.map(item => {
                        return <a key={item.key} className={item.key === this.state.activePaneKey ? activeClassName : ''} onClick={this.handleNavClick.bind(this, item.key)}>{item.props.label}</a>;
                    })
                }
            </nav>
            <div className={HTML.classes('content', contentClassName)}>
                {
                    children.map(item => {
                        if (item.key === this.state.activePaneKey) {
                            return <div key={item.key} className={HTML.classes('tab-pane active', tabPaneClass)}>{item}</div>;
                        }
                        if (cache) {
                            return <div key={item.key} className={HTML.classes('tab-pane hidden', tabPaneClass)}>{item}</div>;
                        }
                        return null;
                    })
                }
            </div>
        </div>);
    }
}
