import React, {Component} from 'react';
import timeSequence from '../utils/time-sequence';
import DisplayLayer from './display-layer';

/**
 * DisplayContainer 组件 ，显示一个弹出层容器组件，用于管理界面上一个或多个弹出层
 * @export
 * @class DisplayContainer
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example @lang jsx
 * <DisplayContainer />
 */
export default class DisplayContainer extends Component {
    /**
     * React 组件构造函数，创建一个 DisplayContainer 组件实例，会在装配之前被调用。
     * @see https://react.docschina.org/docs/react-component.html#constructor
     * @param {Object?} props 组件属性对象
     * @constructor
     */
    constructor(props) {
        super(props);
        this.state = {
            all: {}
        };
    }

    /**
     * 根据 ID 获取弹出层组件实例
     *
     * @param {String} id 弹出层 ID
     * @return {DisplayLayer}
     * @memberof DisplayContainer
     */
    getItem(id) {
        return this.state.all[id];
    }

    /**
     * 显示一个弹出层，如果属性中弹出层 ID 已经存在，则显示之前的弹出层，否则根据属性创建一个新的弹出层
     *
     * @param {Object} props 弹出层配置
     * @param {?Function} callback 完成时的回调函数
     * @return {DisplayLayer}
     * @memberof DisplayContainer
     */
    show(props, callback) {
        const all = this.state.all;
        if (typeof props !== 'object') {
            props = {id: props};
        }
        if (!props.id) {
            props.id = timeSequence();
        }
        const {id} = props;
        const item = all[id];
        if (!item) {
            if (!props.cache) {
                const userOnHidden = props.onHidden;
                props.onHidden = (ref) => {
                    if (userOnHidden) {
                        userOnHidden(ref);
                    }
                    delete all[id];
                    this.setState({all});
                };
            }
            const userOnShow = props.onShown;
            props.onShown = (ref) => {
                if (userOnShow) {
                    userOnShow(ref);
                }
                if (callback) {
                    callback(ref);
                }
            };
            all[id] = {props};
            this.setState({all});
        } else {
            const {style, cache} = props;
            if (cache && style) {
                item.ref.setStyle(style);
            }
            item.ref.show(callback);
            return item.ref;
        }
    }

    /**
     * 隐藏弹出层
     *
     * @param {string} id 要隐藏的弹出层 ID
     * @param {any} callback 操作完成时的回调函数
     * @param {string|Bool} [remove='auto'] 是否在隐藏后移除界面上的元素
     * @return {DisplayLayer}
     * @memberof DisplayContainer
     */
    hide(id, callback, remove = 'auto') {
        const {all} = this.state;
        const item = all[id];
        if (!item) {
            if (DEBUG) {
                console.warn(`Cannot find display layer with id ${id}.`);
            }
            if (callback) {
                callback(false);
            }
            return;
        }
        if (remove === 'auto') {
            remove = !item.props.cache;
        }
        item.ref.hide(() => {
            if (remove) {
                delete all[id];
                this.setState({all});
            }
            if (callback) {
                callback();
            }
        });
        return item.ref;
    }

    /**
     * 隐藏并从界面上移除弹出层
     *
     * @param {string} id 弹出层 ID
     * @param {?Function} callback 操作完成时的回调函数
     * @return {DisplayLayer}
     * @memberof DisplayContainer
     */
    remove(id, callback) {
        return this.hide(id, callback, true);
    }

    /**
     * 在指定 ID 的弹出层上加载新的内容
     *
     * @param {string} id 弹出层 ID
     * @param {String|ReactNode|Function} newContent 弹出层新的内容
     * @param {?Function} callback 操作完成时的回调函数
     * @return {DisplayLayer}
     * @memberof DisplayContainer
     */
    load(id, newContent, callback) {
        const {all} = this.state;
        const item = all[id];
        if (!item) {
            if (DEBUG) {
                console.error(`Cannot find display layer with id ${id}.`);
            }
            return;
        }
        item.ref.loadContent(newContent, callback);
        return item.ref;
    }

    /**
     * 为指定 ID 的弹出层设置新的 CSS 样式
     *
     * @param {string} id 弹出层 ID
     * @param {object} newStyle CSS 样式对象
     * @param {?Function} callback 操作完成时的回调函数
     * @return {DisplayLayer}
     * @memberof DisplayContainer
     */
    setStyle(id, newStyle, callback) {
        const {all} = this.state;
        const item = all[id];
        if (!item) {
            if (DEBUG) {
                console.error(`Cannot find display layer with id ${id}.`);
            }
            return;
        }
        item.ref.setStyle(newStyle, callback);
        return item.ref;
    }

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof DisplayContainer
     * @return {ReactNode}
     */
    render() {
        const {all} = this.state;
        return (
            <div className="display-container dock">
                {
                    Object.keys(all).map(itemId => {
                        const item = all[itemId];
                        const {props} = item;
                        return <DisplayLayer key={itemId} ref={e => {item.ref = e;}} {...props} />;
                    })
                }
            </div>
        );
    }
}
