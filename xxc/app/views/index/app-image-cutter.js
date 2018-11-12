import React, {Component} from 'react';
import Platform from 'Platform';
import ImageCutter from '../../components/image-cutter';

/**
 * AppImageCutter 组件 ，显示图片剪切应用界面（用于在截图窗口中单独显示）
 * @class AppImageCutter
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example @lang jsx
 * import AppImageCutter from './app-image-cutter';
 * <AppImageCutter />
 */
export default class ImageCutterApp extends Component {
    /**
     * 处理图片剪切完成事件
     * @param {Object} image 剪切的图片信息
     * @memberof AppImageCutter
     * @private
     * @return {void}
     */
    onFinishCutImage = (image) => {
        Platform.remote.sendToMainWindow(Platform.remote.EVENT.capture_screen, image);
    }

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof AppImageCutter
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const sourceImageFile = decodeURIComponent(this.props.match.params.file);

        return (<div className="affix">
            <ImageCutter
                onFinish={this.onFinishCutImage}
                sourceImage={sourceImageFile}
            />
        </div>);
    }
}
