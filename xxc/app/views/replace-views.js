/**
 * 获取组件的可替换类，如果找不到可替换类，则返回原始类
 * @param {string} path 组件路径
 * @param {Class<Component>} originView 组件原始类
 * @return {Class<Component>} 组件的可替换类
 */
export default (path, originView) => {
    if (!originView) {
        console.error('Origin view must be set for ', path, originView);
    }
    return (global.replaceViews && global.replaceViews[path]) || originView;
};
