import React, {PureComponent} from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import ImageCutterApp from './app-image-cutter';
import {AppView} from './app-view';
import replaceViews from '../replace-views';

/**
 * HomeIndex 组件 ，显示喧喧应用窗口界面
 * @class HomeIndex
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {PureComponent}
 * @example
 * import HomeIndex from './index';
 * <HomeIndex />
 */
export default class HomeIndex extends PureComponent {
    /**
     * 获取 HomeIndex 组件的可替换类（使用可替换组件类使得扩展中的视图替换功能生效）
     * @type {Class<HomeIndex>}
     * @readonly
     * @static
     * @memberof HomeIndex
     * @example <caption>可替换组件类调用方式</caption>
     * import {HomeIndex} from './index';
     * <HomeIndex />
     */
    static get HomeIndex() {
        return replaceViews('index/index', HomeIndex);
    }

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof HomeIndex
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        return (<Router>
            <Switch>
                <Route path="/image-cutter/:file?" component={ImageCutterApp} />
                <Route path="/:app?" component={AppView} />
            </Switch>
        </Router>);
    }
}
