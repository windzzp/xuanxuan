import React from 'react';
import PropTypes from 'prop-types';
import Emojione from './emojione';

/**
 * EmojioneIcon 组件 ，显示Emojione表情图标
 * @see https://react.docschina.org/docs/components-and-props.html
 * @example @lang jsx
 * import EmojioneIcon from './emojione-icon';
 * <EmojioneIcon />
 * @return {ReactNode|string|number|null|boolean} React 渲染内容
 */
const EmojioneIcon = ({name, ...other}) => (<div {...other} dangerouslySetInnerHTML={{__html: Emojione.toImage(name)}} />); // eslint-disable-line

/**
 * React 组件属性类型检查
 * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
 * @static
 * @memberof EmojioneIcon
 * @type {Object}
 */
EmojioneIcon.propTypes = {
    name: PropTypes.string.isRequired
};

export default EmojioneIcon;
