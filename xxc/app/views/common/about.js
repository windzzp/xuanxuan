import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Config from '../../config';
import HTML from '../../utils/html-helper';
import Lang from '../../lang';
import {BuildInfo} from '../common/build-info';
import replaceViews from '../replace-views';

/**
 * About 组件 ，显示应用关于界面
 * @class About
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {PureComponent}
 * @example @lang jsx
 * import About from './about';
 * <About />
 */
export default class About extends PureComponent {
    /**
     * 获取 About 组件的可替换类（使用可替换组件类使得扩展中的视图替换功能生效）
     * @type {Class<About>}
     * @readonly
     * @static
     * @memberof About
     * @example <caption>可替换组件类调用方式</caption> @lang jsx
     * import {About} from './about';
     * <About />
     */
    static get About() {
        return replaceViews('common/about', About);
    }

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof About
     * @type {Object}
     */
    static propTypes = {
        className: PropTypes.string,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof About
     * @static
     */
    static defaultProps = {
        className: null,
    };

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof About
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            className,
            ...other
        } = this.props;

        return (<div
            {...other}
            className={HTML.classes('app-about center-content space', className)}
        >
            <section className="text-center">
                <img src={`${Config.media['image.path']}logo.png`} alt="logo" />
                <BuildInfo className="space-sm" />
                {Config.pkg.homepage ? <div className="space-xl"><a target="_blank" className="btn rounded text-primary strong" href={Config.pkg.homepage}><strong>{Config.pkg.homepage}</strong></a></div> : null}
                {Config.pkg.license ? <div><a target="_blank" className="btn rounded" href="https://github.com/easysoft/xuanxuan/blob/master/LICENSE">{`Open source license ${Config.pkg.license}`}</a></div> : null}
                {Config.pkg.company ? <div><a target="_blank" className="btn rounded" href="http://cnezsoft.com/">{Lang.format('common.copyrightFormat', {year: new Date().getFullYear(), name: Config.pkg.company})}</a></div> : null}
                {Config.ui.about ? <div>{Config.ui.about}</div> : null}
                <div><a target="_blank" className="btn rounded" href="http://emojione.com/">Thanks to EmojiOne for providing free emoji icons</a></div>
            </section>
        </div>);
    }
}
