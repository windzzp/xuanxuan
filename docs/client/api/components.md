# `components`

模块 `components` 的所有原始文件都可以在 [${repository.clientSourceRoot}app/components](${repository.sourceUrl}${repository.clientSourceRoot}app/components) 目录下找到。

## 模块

<dl>
<dt><a href="#module_context-menu">context-menu</a></dt>
<dd></dd>
<dt><a href="#module_display">display</a></dt>
<dd></dd>
<dt><a href="#module_image-viewer">image-viewer</a></dt>
<dd></dd>
<dt><a href="#module_messager">messager</a></dt>
<dd></dd>
<dt><a href="#module_modal">modal</a></dt>
<dd></dd>
<dt><a href="#module_popover">popover</a></dt>
<dd></dd>
</dl>

## 类 (class)

<dl>
<dt><a href="#AppAvatar">AppAvatar</a> ⇐ <code>PureComponent</code></dt>
<dd></dd>
<dt><a href="#AreaSelector">AreaSelector</a> ⇐ <code>Component</code></dt>
<dd></dd>
<dt><a href="#Avatar">Avatar</a> ⇐ <code>PureComponent</code></dt>
<dd></dd>
<dt><a href="#Button">Button</a> ⇐ <code>PureComponent</code></dt>
<dd></dd>
<dt><a href="#Checkbox">Checkbox</a> ⇐ <code>PureComponent</code></dt>
<dd></dd>
<dt><a href="#ClickOutsideWrapper">ClickOutsideWrapper</a> ⇐ <code>PureComponent</code></dt>
<dd></dd>
<dt><a href="#DisplayContainer">DisplayContainer</a> ⇐ <code>Component</code></dt>
<dd></dd>
<dt><a href="#DisplayLayer">DisplayLayer</a> ⇐ <code>PureComponent</code></dt>
<dd></dd>
<dt><a href="#GroupList">GroupList</a> ⇐ <code>PureComponent</code></dt>
<dd></dd>
<dt><a href="#Heading">Heading</a> ⇐ <code>PureComponent</code></dt>
<dd></dd>
<dt><a href="#HotkeyInputControl">HotkeyInputControl</a> ⇐ <code>Component</code></dt>
<dd></dd>
<dt><a href="#Icon">Icon</a> ⇐ <code>PureComponent</code></dt>
<dd></dd>
<dt><a href="#ImageCutter">ImageCutter</a> ⇐ <code>Component</code></dt>
<dd></dd>
<dt><a href="#ImageHolder">ImageHolder</a> ⇐ <code>PureComponent</code></dt>
<dd></dd>
<dt><a href="#InputControl">InputControl</a> ⇐ <code>PureComponent</code></dt>
<dd></dd>
<dt><a href="#ListItem">ListItem</a> ⇐ <code>PureComponent</code></dt>
<dd></dd>
<dt><a href="#Pager">Pager</a> ⇐ <code>PureComponent</code></dt>
<dd></dd>
<dt><a href="#RadioGroup">RadioGroup</a> ⇐ <code>PureComponent</code></dt>
<dd></dd>
<dt><a href="#Radio">Radio</a> ⇐ <code>Component</code></dt>
<dd></dd>
<dt><a href="#SearchControl">SearchControl</a> ⇐ <code>PureComponent</code></dt>
<dd></dd>
<dt><a href="#SelectBox">SelectBox</a> ⇐ <code>Component</code></dt>
<dd></dd>
<dt><a href="#Spinner">Spinner</a> ⇐ <code>PureComponent</code></dt>
<dd></dd>
<dt><a href="#TabPane">TabPane</a> ⇐ <code>PureComponent</code></dt>
<dd></dd>
<dt><a href="#Tabs">Tabs</a> ⇐ <code>PureComponent</code></dt>
<dd></dd>
</dl>

<a name="module_context-menu"></a>

## context-menu

* * *

<a name="module_context-menu.showContextMenu"></a>

### `context-menu.showContextMenu(position, menus, props, callback)` ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
<p>显示上下文菜单</p>

**类型**: 静态方法(function)，来自 [<code>context-menu</code>](#module_context-menu)  
**简述**: <p>显示上下文菜单</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| position | <code>Object</code> | <p>菜单显示位置，需要提供 X 和 Y 轴坐标</p> |
| menus | <code>Array.&lt;Object&gt;</code> | <p>菜单项列表</p> |
| props | <code>Object</code> | <p>DisplayLayer 组件属性</p> |
| callback | <code>function</code> | <p>操作完成时的回调函数</p> |


* * *

<a name="module_display"></a>

## display

* [display](#module_display)
    * [`.displayShow(props, callback)`](#module_display.displayShow) ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
    * [`.displayHide(id, callback, remove)`](#module_display.displayHide) ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
    * [`.displayRemove(id, callback)`](#module_display.displayRemove) ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
    * [`.displayGetRef(id)`](#module_display.displayGetRef) ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
    * [`.displaySetStyle(id, newStyle, callback)`](#module_display.displaySetStyle) ⇒ [<code>DisplayLayer</code>](#DisplayLayer)


* * *

<a name="module_display.displayShow"></a>

### `display.displayShow(props, callback)` ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
<p>显示弹出层</p>

**类型**: 静态方法(function)，来自 [<code>display</code>](#module_display)  
**简述**: <p>显示弹出层</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| props | <code>Object</code> | <p>弹出层初始化对象</p> |
| callback | <code>function</code> | <p>操作完成后的回调函数</p> |


* * *

<a name="module_display.displayHide"></a>

### `display.displayHide(id, callback, remove)` ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
<p>隐藏指定 ID 的弹出层</p>

**类型**: 静态方法(function)，来自 [<code>display</code>](#module_display)  
**简述**: <p>隐藏指定 ID 的弹出层</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| id | <code>string</code> | <p>弹出层 ID</p> |
| callback | <code>function</code> | <p>操作完成后的回调函数</p> |
| remove | <code>boolean</code> | <p>是否在隐藏后从界面上移除元素</p> |


* * *

<a name="module_display.displayRemove"></a>

### `display.displayRemove(id, callback)` ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
<p>隐藏并从界面上移除指定 ID 的弹出层</p>

**类型**: 静态方法(function)，来自 [<code>display</code>](#module_display)  
**简述**: <p>隐藏并从界面上移除指定 ID 的弹出层</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| id | <code>string</code> | <p>弹出层 ID</p> |
| callback | <code>function</code> | <p>操作完成后的回调函数</p> |


* * *

<a name="module_display.displayGetRef"></a>

### `display.displayGetRef(id)` ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
<p>获取指定 ID 的弹出层组件实例</p>

**类型**: 静态方法(function)，来自 [<code>display</code>](#module_display)  
**简述**: <p>获取指定 ID 的弹出层组件实例</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| id | <code>string</code> | <p>弹出层 ID</p> |


* * *

<a name="module_display.displaySetStyle"></a>

### `display.displaySetStyle(id, newStyle, callback)` ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
<p>设置指定 ID 弹出层界面元素上的样式</p>

**类型**: 静态方法(function)，来自 [<code>display</code>](#module_display)  
**简述**: <p>设置指定 ID 弹出层界面元素上的样式</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| id | <code>string</code> | <p>弹出层 ID</p> |
| newStyle | <code>Object</code> | <p>CSS 样式对象</p> |
| callback | <code>function</code> | <p>操作完成后的回调函数</p> |


* * *

<a name="module_image-viewer"></a>

## image-viewer

* * *

<a name="module_image-viewer.showImageViewer"></a>

### `image-viewer.showImageViewer(imageSrc, props, callback)` ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
<p>显示一个图片预览弹出层</p>

**类型**: 静态方法(function)，来自 [<code>image-viewer</code>](#module_image-viewer)  
**简述**: <p>显示一个图片预览弹出层</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| imageSrc | <code>string</code> | <p>图片地址</p> |
| props | <code>Object</code> | <p>DisplayLayer 组件属性</p> |
| callback | <code>function</code> | <p>操作完成时的回调函数</p> |


* * *

<a name="module_messager"></a>

## messager

* * *

<a name="module_messager.showMessager"></a>

### `messager.showMessager` ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
<p>显示浮动的提示消息</p>

**类型**: 静态常量(const)，来自 [<code>messager</code>](#module_messager)  
**简述**: <p>显示浮动的提示消息</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| message | <code>String</code> \| <code>ReactNode</code> | <p>消息内容</p> |
| props | <code>Object</code> | <p>DisplayLayer 组件属性</p> |
| callback | <code>function</code> | <p>操作完成时的回调函数</p> |


* * *

<a name="module_modal"></a>

## modal

* [modal](#module_modal)
    * [`.showModal(props, callback)`](#module_modal.showModal) ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
    * [`.showAlert(content, props, callback)`](#module_modal.showAlert) ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
    * [`.showConfirm(content, props, callback)`](#module_modal.showConfirm) ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
    * [`.showPrompt(title, defaultValue, props, callback)`](#module_modal.showPrompt) ⇒ [<code>DisplayLayer</code>](#DisplayLayer)


* * *

<a name="module_modal.showModal"></a>

### `modal.showModal(props, callback)` ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
<p>显示对话框</p>

**类型**: 静态方法(function)，来自 [<code>modal</code>](#module_modal)  
**简述**: <p>显示对话框</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| props | <code>Object</code> | <p>DisplayLayer 组件属性</p> |
| callback | <code>function</code> | <p>操作完成时的回调函数</p> |


* * *

<a name="module_modal.showAlert"></a>

### `modal.showAlert(content, props, callback)` ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
<p>显示警告对话框</p>

**类型**: 静态方法(function)，来自 [<code>modal</code>](#module_modal)  
**简述**: <p>显示警告对话框</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| content | <code>String</code> \| <code>ReactNode</code> \| <code>function</code> | <p>对话框内容</p> |
| props | <code>Object</code> | <p>DisplayLayer 组件属性</p> |
| callback | <code>function</code> | <p>操作完成时的回调函数</p> |


* * *

<a name="module_modal.showConfirm"></a>

### `modal.showConfirm(content, props, callback)` ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
<p>显示确认对话框</p>

**类型**: 静态方法(function)，来自 [<code>modal</code>](#module_modal)  
**简述**: <p>显示确认对话框</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| content | <code>String</code> \| <code>ReactNode</code> \| <code>function</code> | <p>对话框内容</p> |
| props | <code>Object</code> | <p>DisplayLayer 组件属性</p> |
| callback | <code>function</code> | <p>操作完成时的回调函数</p> |


* * *

<a name="module_modal.showPrompt"></a>

### `modal.showPrompt(title, defaultValue, props, callback)` ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
<p>显示询问用户输入值的对话框</p>

**类型**: 静态方法(function)，来自 [<code>modal</code>](#module_modal)  
**简述**: <p>显示询问用户输入值的对话框</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| title | <code>String</code> \| <code>ReactNode</code> \| <code>function</code> | <p>标题</p> |
| defaultValue | <code>string</code> | <p>默认值</p> |
| props | <code>Object</code> | <p>DisplayLayer 组件属性</p> |
| callback | <code>function</code> | <p>操作完成时的回调函数</p> |


* * *

<a name="module_popover"></a>

## popover

* * *

<a name="module_popover.showPopover"></a>

### `popover.showPopover(position, content, props, callback)` ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
<p>显示一个提示面板</p>

**类型**: 静态方法(function)，来自 [<code>popover</code>](#module_popover)  
**简述**: <p>显示一个提示面板</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| position | <code>Object</code> | <p>提示面板显示位置，需要提供 X 和 Y 轴坐标</p> |
| content | <code>String</code> \| <code>ReactNode</code> \| <code>function</code> | <p>提示面板内容</p> |
| props | <code>Object</code> | <p>DisplayLayer 组件属性</p> |
| callback | <code>function</code> | <p>操作完成时的回调函数</p> |


* * *

<a name="AppAvatar"></a>

## AppAvatar ⇐ <code>PureComponent</code>
**类型**: 全局类(class)  
**简述**: <p>AppAvatar 组件 ，显示一个应用图标</p>.
**继承自 (extends)**: <code>PureComponent</code>
**参见**: https://react.docschina.org/docs/components-and-props.html
**属性**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| avatar | <code>string</code> \| <code>Object</code> \| <code>ReactNode</code> | <p>头像或者用于创建头像的值</p> |
| label | <code>string</code> \| <code>ReactNode</code> | <p>应用名称</p> |
| className | <code>string</code> | <p>CSS 类名</p> |
| children | <code>string</code> | <p>子组件</p> |


* [AppAvatar](#AppAvatar) ⇐ <code>PureComponent</code>
    * [`new AppAvatar()`](#new_AppAvatar_new)
    * [`.propTypes`](#AppAvatar.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#AppAvatar.defaultProps) : <code>object</code>


* * *

<a name="new_AppAvatar_new"></a>

### `new AppAvatar()`
<p>AppAvatar 组件 ，显示一个应用图标</p>

**示例** *(导入组件)*  
```js
import AppAvatar from './components/app-avatar';
```
**示例**  
```jsx
<AppAvatar />
```

* * *

<a name="AppAvatar.propTypes"></a>

### `AppAvatar.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>AppAvatar</code>](#AppAvatar)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="AppAvatar.defaultProps"></a>

### `AppAvatar.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>AppAvatar</code>](#AppAvatar)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="AreaSelector"></a>

## AreaSelector ⇐ <code>Component</code>
**类型**: 全局类(class)  
**简述**: <p>AreaSelector 组件 ，显示一个AreaSelector</p>.
**继承自 (extends)**: <code>Component</code>
**Export**:   
**参见**: https://react.docschina.org/docs/components-and-props.html

* [AreaSelector](#AreaSelector) ⇐ <code>Component</code>
    * [`new AreaSelector()`](#new_AreaSelector_new)
    * [`.propTypes`](#AreaSelector.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#AreaSelector.defaultProps) : <code>object</code>
    * [`.setSelect(select)`](#AreaSelector.setSelect) ⇒ <code>Void</code>


* * *

<a name="new_AreaSelector_new"></a>

### `new AreaSelector()`
<p>AreaSelector 组件 ，显示一个AreaSelector</p>

**示例**  
```jsx
<AreaSelector />
```

* * *

<a name="AreaSelector.propTypes"></a>

### `AreaSelector.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>AreaSelector</code>](#AreaSelector)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="AreaSelector.defaultProps"></a>

### `AreaSelector.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>AreaSelector</code>](#AreaSelector)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="AreaSelector.setSelect"></a>

### `AreaSelector.setSelect(select)` ⇒ <code>Void</code>
<p>Set select range
设置选择的范围</p>

**类型**: 静态方法(function)，来自 [<code>AreaSelector</code>](#AreaSelector)  
**简述**: <p>Set select range
设置选择的范围</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| select | <code>Object</code> | <p>选择对范围对象</p> |


* * *

<a name="Avatar"></a>

## Avatar ⇐ <code>PureComponent</code>
**类型**: 全局类(class)  
**简述**: <p>Avatar 组件 ，显示一个头像</p>.
**继承自 (extends)**: <code>PureComponent</code>
**参见**: https://react.docschina.org/docs/components-and-props.html

* [Avatar](#Avatar) ⇐ <code>PureComponent</code>
    * [`new Avatar()`](#new_Avatar_new)
    * [`.propTypes`](#Avatar.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#Avatar.defaultProps) : <code>object</code>
    * [`.render(avatar, iconView)`](#Avatar.render) ⇒ <code>ReactNode</code>


* * *

<a name="new_Avatar_new"></a>

### `new Avatar()`
<p>Avatar 组件 ，显示一个头像</p>

**示例** *(使用图片创建头像)*  
```js
<Avatar image="http://example.com/user-avatar.png" />
```
**示例** *(使用文本创建头像)*  
```js
<Avatar label="福" />
```
**示例** *(应用 skin 外观)*  
```js
<Avatar label="福" skin="23" />
```
**示例** *(应用尺寸)*  
```js
<Avatar label="福" size="48" />
```

* * *

<a name="Avatar.propTypes"></a>

### `Avatar.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>Avatar</code>](#Avatar)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="Avatar.defaultProps"></a>

### `Avatar.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>Avatar</code>](#Avatar)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="Avatar.render"></a>

### `Avatar.render(avatar, iconView)` ⇒ <code>ReactNode</code>
<p>创建一个头像组件</p>

**类型**: 静态方法(function)，来自 [<code>Avatar</code>](#Avatar)  
**简述**: <p>创建一个头像组件</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| avatar | <code>any</code> | <p>头像内容</p> |
| iconView | <code>any</code> | <p>图标内容</p> |


* * *

<a name="Button"></a>

## Button ⇐ <code>PureComponent</code>
**类型**: 全局类(class)  
**简述**: <p>Button 组件 ，显示一个按钮</p>.
**继承自 (extends)**: <code>PureComponent</code>
**参见**: https://react.docschina.org/docs/components-and-props.html

* [Button](#Button) ⇐ <code>PureComponent</code>
    * [`new Button()`](#new_Button_new)
    * [`.propTypes`](#Button.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#Button.defaultProps) : <code>object</code>


* * *

<a name="new_Button_new"></a>

### `new Button()`
<p>Button 组件 ，显示一个按钮</p>

**示例**  
```jsx
<Button />
```

* * *

<a name="Button.propTypes"></a>

### `Button.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>Button</code>](#Button)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="Button.defaultProps"></a>

### `Button.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>Button</code>](#Button)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="Checkbox"></a>

## Checkbox ⇐ <code>PureComponent</code>
**类型**: 全局类(class)  
**简述**: <p>Checkbox 组件 ，显示一个复选框</p>.
**继承自 (extends)**: <code>PureComponent</code>
**参见**: https://react.docschina.org/docs/components-and-props.html

* [Checkbox](#Checkbox) ⇐ <code>PureComponent</code>
    * [`new Checkbox()`](#new_Checkbox_new)
    * [`.propTypes`](#Checkbox.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#Checkbox.defaultProps) : <code>object</code>


* * *

<a name="new_Checkbox_new"></a>

### `new Checkbox()`
<p>Checkbox 组件 ，显示一个复选框</p>

**示例**  
```jsx
<Checkbox />
```

* * *

<a name="Checkbox.propTypes"></a>

### `Checkbox.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>Checkbox</code>](#Checkbox)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="Checkbox.defaultProps"></a>

### `Checkbox.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>Checkbox</code>](#Checkbox)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="ClickOutsideWrapper"></a>

## ClickOutsideWrapper ⇐ <code>PureComponent</code>
**类型**: 全局类(class)  
**简述**: <p>ClickOutsideWrapper 组件 ，显示一个ClickOutsideWrapper（允许监听元素外点击事件的容器元素，可以很方便的使用此组件制作点击外部即关闭的弹出层）</p>.
**继承自 (extends)**: <code>PureComponent</code>
**参见**: https://react.docschina.org/docs/components-and-props.html

* [ClickOutsideWrapper](#ClickOutsideWrapper) ⇐ <code>PureComponent</code>
    * [`new ClickOutsideWrapper()`](#new_ClickOutsideWrapper_new)
    * [`.propTypes`](#ClickOutsideWrapper.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#ClickOutsideWrapper.defaultProps) : <code>object</code>


* * *

<a name="new_ClickOutsideWrapper_new"></a>

### `new ClickOutsideWrapper()`
<p>ClickOutsideWrapper 组件 ，显示一个ClickOutsideWrapper（允许监听元素外点击事件的容器元素，可以很方便的使用此组件制作点击外部即关闭的弹出层）</p>

**示例** *(制作一个点击外部即关闭的对话框)*  
```js
let isDialogOpen = true;
const renderDialog = props => {
    return isDialogOpen ? (<ClickOutsideWrapper
        onClickOutside={e => {
             isDialogOpen = false;
        }}
    >
         <h1>Dialog heading</h1>
         <div>dialog content...</div>
    </ClickOutsideWrapper>) : null;
};
```

* * *

<a name="ClickOutsideWrapper.propTypes"></a>

### `ClickOutsideWrapper.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>ClickOutsideWrapper</code>](#ClickOutsideWrapper)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="ClickOutsideWrapper.defaultProps"></a>

### `ClickOutsideWrapper.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>ClickOutsideWrapper</code>](#ClickOutsideWrapper)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="DisplayContainer"></a>

## DisplayContainer ⇐ <code>Component</code>
**类型**: 全局类(class)  
**简述**: <p>DisplayContainer 组件 ，显示一个弹出层容器组件，用于管理界面上一个或多个弹出层</p>.
**继承自 (extends)**: <code>Component</code>
**参见**: https://react.docschina.org/docs/components-and-props.html

* [DisplayContainer](#DisplayContainer) ⇐ <code>Component</code>
    * [`new DisplayContainer()`](#new_DisplayContainer_new)
    * [`.getItem(id)`](#DisplayContainer.getItem) ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
    * [`.show(props, callback)`](#DisplayContainer.show) ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
    * [`.hide(id, callback, [remove])`](#DisplayContainer.hide) ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
    * [`.remove(id, callback)`](#DisplayContainer.remove) ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
    * [`.load(id, newContent, callback)`](#DisplayContainer.load) ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
    * [`.setStyle(id, newStyle, callback)`](#DisplayContainer.setStyle) ⇒ [<code>DisplayLayer</code>](#DisplayLayer)


* * *

<a name="new_DisplayContainer_new"></a>

### `new DisplayContainer()`
<p>DisplayContainer 组件 ，显示一个弹出层容器组件，用于管理界面上一个或多个弹出层</p>

**示例**  
```jsx
<DisplayContainer />
```

* * *

<a name="DisplayContainer.getItem"></a>

### `DisplayContainer.getItem(id)` ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
<p>根据 ID 获取弹出层组件实例</p>

**类型**: 静态方法(function)，来自 [<code>DisplayContainer</code>](#DisplayContainer)  
**简述**: <p>根据 ID 获取弹出层组件实例</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| id | <code>string</code> | <p>弹出层 ID</p> |


* * *

<a name="DisplayContainer.show"></a>

### `DisplayContainer.show(props, callback)` ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
<p>显示一个弹出层，如果属性中弹出层 ID 已经存在，则显示之前的弹出层，否则根据属性创建一个新的弹出层</p>

**类型**: 静态方法(function)，来自 [<code>DisplayContainer</code>](#DisplayContainer)  
**简述**: <p>显示一个弹出层，如果属性中弹出层 ID 已经存在，则显示之前的弹出层，否则根据属性创建一个新的弹出层</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| props | <code>Object</code> | <p>弹出层配置</p> |
| callback | <code>function</code> | <p>完成时的回调函数</p> |


* * *

<a name="DisplayContainer.hide"></a>

### `DisplayContainer.hide(id, callback, [remove])` ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
<p>隐藏弹出层</p>

**类型**: 静态方法(function)，来自 [<code>DisplayContainer</code>](#DisplayContainer)  
**简述**: <p>隐藏弹出层</p>.

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| id | <code>string</code> |  | <p>要隐藏的弹出层 ID</p> |
| callback | <code>any</code> |  | <p>操作完成时的回调函数</p> |
| [remove] | <code>string</code> \| <code>Bool</code> | <code>&quot;&#x27;auto&#x27;&quot;</code> | <p>是否在隐藏后移除界面上的元素</p> |


* * *

<a name="DisplayContainer.remove"></a>

### `DisplayContainer.remove(id, callback)` ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
<p>隐藏并从界面上移除弹出层</p>

**类型**: 静态方法(function)，来自 [<code>DisplayContainer</code>](#DisplayContainer)  
**简述**: <p>隐藏并从界面上移除弹出层</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| id | <code>string</code> | <p>弹出层 ID</p> |
| callback | <code>function</code> | <p>操作完成时的回调函数</p> |


* * *

<a name="DisplayContainer.load"></a>

### `DisplayContainer.load(id, newContent, callback)` ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
<p>在指定 ID 的弹出层上加载新的内容</p>

**类型**: 静态方法(function)，来自 [<code>DisplayContainer</code>](#DisplayContainer)  
**简述**: <p>在指定 ID 的弹出层上加载新的内容</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| id | <code>string</code> | <p>弹出层 ID</p> |
| newContent | <code>String</code> \| <code>ReactNode</code> \| <code>function</code> | <p>弹出层新的内容</p> |
| callback | <code>function</code> | <p>操作完成时的回调函数</p> |


* * *

<a name="DisplayContainer.setStyle"></a>

### `DisplayContainer.setStyle(id, newStyle, callback)` ⇒ [<code>DisplayLayer</code>](#DisplayLayer)
<p>为指定 ID 的弹出层设置新的 CSS 样式</p>

**类型**: 静态方法(function)，来自 [<code>DisplayContainer</code>](#DisplayContainer)  
**简述**: <p>为指定 ID 的弹出层设置新的 CSS 样式</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| id | <code>string</code> | <p>弹出层 ID</p> |
| newStyle | <code>object</code> | <p>CSS 样式对象</p> |
| callback | <code>function</code> | <p>操作完成时的回调函数</p> |


* * *

<a name="DisplayLayer"></a>

## DisplayLayer ⇐ <code>PureComponent</code>
**类型**: 全局类(class)  
**简述**: <p>DisplayLayer 组件 ，显示一个弹出层
所有可用的动画名称包括：</p>
<ul>
<li>scale-from-top</li>
<li>scale-from-bottom</li>
<li>scale-from-left</li>
<li>scale-from-right</li>
<li>scale-from-center</li>
<li>enter-from-top</li>
<li>enter-from-bottom</li>
<li>enter-from-left</li>
<li>enter-from-right</li>
<li>enter-from-center</li>
</ul>.
**继承自 (extends)**: <code>PureComponent</code>
**参见**: https://react.docschina.org/docs/components-and-props.html
**属性**

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| plugName | <code>string</code> |  | <p>组件名称，会影响 CSS 类名</p> |
| animation | <code>string</code> |  | <p>动画效果类型</p> |
| [modal] | <code>boolean</code> | <code>false</code> | <p>是否以模态形式显示，如果设置为 true，点击背景层不会自动隐藏</p> |
| [show] | <code>boolean</code> | <code>true</code> | <p>是否在初始化之后立即显示</p> |
| content | <code>String</code> \| <code>ReactNode</code> \| <code>function</code> |  | <p>内容，可以为一个函数返回一个 Promise 来实现内容的懒加载</p> |


* [DisplayLayer](#DisplayLayer) ⇐ <code>PureComponent</code>
    * [`new DisplayLayer()`](#new_DisplayLayer_new)
    * [`.STAGE`](#DisplayLayer.STAGE) : <code>Status</code>
    * [`.propTypes`](#DisplayLayer.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#DisplayLayer.defaultProps) : <code>object</code>
    * [`.stageName`](#DisplayLayer.stageName) : <code>string</code>
    * [`.isShow`](#DisplayLayer.isShow) : <code>boolean</code>
    * [`.isHide`](#DisplayLayer.isHide) : <code>boolean</code>
    * [`.isStage(stage)`](#DisplayLayer.isStage) ⇒ <code>boolean</code>
    * [`.changeStage(stage)`](#DisplayLayer.changeStage) ⇒ <code>void</code>
    * [`.setStyle(style, callback)`](#DisplayLayer.setStyle) ⇒ <code>void</code>
    * [`.show(callback)`](#DisplayLayer.show) ⇒ <code>void</code>
    * [`.hide(callback)`](#DisplayLayer.hide) ⇒ <code>void</code>
    * [`.loadContent(newContent, callback)`](#DisplayLayer.loadContent) ⇒ <code>void</code>
    * [`.reset()`](#DisplayLayer.reset) ⇒ <code>void</code>


* * *

<a name="new_DisplayLayer_new"></a>

### `new DisplayLayer()`
<p>DisplayLayer 组件 ，显示一个弹出层
所有可用的动画名称包括：</p>
<ul>
<li>scale-from-top</li>
<li>scale-from-bottom</li>
<li>scale-from-left</li>
<li>scale-from-right</li>
<li>scale-from-center</li>
<li>enter-from-top</li>
<li>enter-from-bottom</li>
<li>enter-from-left</li>
<li>enter-from-right</li>
<li>enter-from-center</li>
</ul>

**示例**  
```jsx
<DisplayLayer />
```

* * *

<a name="DisplayLayer.STAGE"></a>

### `DisplayLayer.STAGE` : <code>Status</code>
<p>DisplayLayer 显示状态
共 4 个状态</p>
<ul>
<li>init，需要初始化</li>
<li>ready，准备好进行显示</li>
<li>shown，已经显示</li>
<li>hidden，已经隐藏</li>
</ul>

**类型**: 静态属性(property)，来自 [<code>DisplayLayer</code>](#DisplayLayer)  
**简述**: <p>DisplayLayer 显示状态
共 4 个状态</p>
<ul>
<li>init，需要初始化</li>
<li>ready，准备好进行显示</li>
<li>shown，已经显示</li>
<li>hidden，已经隐藏</li>
</ul>.

* * *

<a name="DisplayLayer.propTypes"></a>

### `DisplayLayer.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>DisplayLayer</code>](#DisplayLayer)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="DisplayLayer.defaultProps"></a>

### `DisplayLayer.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>DisplayLayer</code>](#DisplayLayer)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="DisplayLayer.stageName"></a>

### `DisplayLayer.stageName` : <code>string</code>
<p>获取组件名称</p>

**类型**: 静态属性(property)，来自 [<code>DisplayLayer</code>](#DisplayLayer)  
**简述**: <p>获取组件名称</p>.

* * *

<a name="DisplayLayer.isShow"></a>

### `DisplayLayer.isShow` : <code>boolean</code>
<p>检查组件是否显示</p>

**类型**: 静态属性(property)，来自 [<code>DisplayLayer</code>](#DisplayLayer)  
**简述**: <p>检查组件是否显示</p>.

* * *

<a name="DisplayLayer.isHide"></a>

### `DisplayLayer.isHide` : <code>boolean</code>
<p>检查组件是否隐藏</p>

**类型**: 静态属性(property)，来自 [<code>DisplayLayer</code>](#DisplayLayer)  
**简述**: <p>检查组件是否隐藏</p>.

* * *

<a name="DisplayLayer.isStage"></a>

### `DisplayLayer.isStage(stage)` ⇒ <code>boolean</code>
<p>检查当前状态是否为指定的状态</p>

**类型**: 静态方法(function)，来自 [<code>DisplayLayer</code>](#DisplayLayer)  
**简述**: <p>检查当前状态是否为指定的状态</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| stage | <code>String</code> \| <code>Number</code> | <p>要检查的状态序号或者名称</p> |


* * *

<a name="DisplayLayer.changeStage"></a>

### `DisplayLayer.changeStage(stage)` ⇒ <code>void</code>
<p>变更状态</p>

**类型**: 静态方法(function)，来自 [<code>DisplayLayer</code>](#DisplayLayer)  
**简述**: <p>变更状态</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| stage | <code>String</code> \| <code>Number</code> | <p>要变更的状态</p> |


* * *

<a name="DisplayLayer.setStyle"></a>

### `DisplayLayer.setStyle(style, callback)` ⇒ <code>void</code>
<p>设置界面元素上的样式</p>

**类型**: 静态方法(function)，来自 [<code>DisplayLayer</code>](#DisplayLayer)  
**简述**: <p>设置界面元素上的样式</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| style | <code>Object</code> | <p>要设置的样式对象</p> |
| callback | <code>function</code> | <p>设置完成后的回调函数</p> |


* * *

<a name="DisplayLayer.show"></a>

### `DisplayLayer.show(callback)` ⇒ <code>void</code>
<p>显示 DisplayLayer</p>

**类型**: 静态方法(function)，来自 [<code>DisplayLayer</code>](#DisplayLayer)  
**简述**: <p>显示 DisplayLayer</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| callback | <code>function</code> | <p>完成后的回调函数</p> |


* * *

<a name="DisplayLayer.hide"></a>

### `DisplayLayer.hide(callback)` ⇒ <code>void</code>
<p>隐藏 DisplayLayer</p>

**类型**: 静态方法(function)，来自 [<code>DisplayLayer</code>](#DisplayLayer)  
**简述**: <p>隐藏 DisplayLayer</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| callback | <code>function</code> | <p>完成后的回调函数</p> |


* * *

<a name="DisplayLayer.loadContent"></a>

### `DisplayLayer.loadContent(newContent, callback)` ⇒ <code>void</code>
<p>在弹出层上加载新的内容</p>

**类型**: 静态方法(function)，来自 [<code>DisplayLayer</code>](#DisplayLayer)  
**简述**: <p>在弹出层上加载新的内容</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| newContent | <code>String</code> \| <code>ReactNode</code> \| <code>function</code> | <p>新的内容</p> |
| callback | <code>function</code> | <p>完成后的回调函数</p> |


* * *

<a name="DisplayLayer.reset"></a>

### `DisplayLayer.reset()` ⇒ <code>void</code>
<p>重置状态为 init（需要初始化）</p>

**类型**: 静态方法(function)，来自 [<code>DisplayLayer</code>](#DisplayLayer)  
**简述**: <p>重置状态为 init（需要初始化）</p>.

* * *

<a name="GroupList"></a>

## GroupList ⇐ <code>PureComponent</code>
**类型**: 全局类(class)  
**简述**: <p>GroupList 组件 ，显示一个分组列表</p>.
**继承自 (extends)**: <code>PureComponent</code>
**参见**: https://react.docschina.org/docs/components-and-props.html

* [GroupList](#GroupList) ⇐ <code>PureComponent</code>
    * [`new GroupList()`](#new_GroupList_new)
    * [`.propTypes`](#GroupList.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#GroupList.defaultProps) : <code>object</code>
    * [`.isExpand`](#GroupList.isExpand) : <code>boolean</code>
    * [`.render(list, props, page, onRequestMore)`](#GroupList.render) ⇒ <code>ReactNode</code>
    * [`.toggle(expand, callback)`](#GroupList.toggle) ⇒ <code>void</code>
    * [`.expand(callback)`](#GroupList.expand) ⇒ <code>void</code>
    * [`.collapse(callback)`](#GroupList.collapse) ⇒ <code>void</code>


* * *

<a name="new_GroupList_new"></a>

### `new GroupList()`
<p>GroupList 组件 ，显示一个分组列表</p>

**示例**  
```jsx
<GroupList />
```

* * *

<a name="GroupList.propTypes"></a>

### `GroupList.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>GroupList</code>](#GroupList)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="GroupList.defaultProps"></a>

### `GroupList.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>GroupList</code>](#GroupList)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="GroupList.isExpand"></a>

### `GroupList.isExpand` : <code>boolean</code>
<p>检查是否展开</p>

**类型**: 静态属性(property)，来自 [<code>GroupList</code>](#GroupList)  
**简述**: <p>检查是否展开</p>.

* * *

<a name="GroupList.render"></a>

### `GroupList.render(list, props, page, onRequestMore)` ⇒ <code>ReactNode</code>
<p>渲染一个分组列表</p>

**类型**: 静态方法(function)，来自 [<code>GroupList</code>](#GroupList)  
**简述**: <p>渲染一个分组列表</p>.

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| list | <code>Array.&lt;Object&gt;</code> |  | <p>列表项配置列表</p> |
| props | <code>Object</code> |  | <p>组件属性</p> |
| page | <code>number</code> | <code>0</code> | <p>页码</p> |
| onRequestMore | <code>function</code> | <code></code> | <p>当点击更多时的回调函数</p> |


* * *

<a name="GroupList.toggle"></a>

### `GroupList.toggle(expand, callback)` ⇒ <code>void</code>
<p>切换展开或折叠分组</p>

**类型**: 静态方法(function)，来自 [<code>GroupList</code>](#GroupList)  
**简述**: <p>切换展开或折叠分组</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| expand | <code>bool</code> | <p>如果设置为 true，则展开分组，如果为 false，则折叠分组，否则自动切换</p> |
| callback | <code>function</code> | <p>操作完成时的回调函数</p> |


* * *

<a name="GroupList.expand"></a>

### `GroupList.expand(callback)` ⇒ <code>void</code>
<p>展开分组</p>

**类型**: 静态方法(function)，来自 [<code>GroupList</code>](#GroupList)  
**简述**: <p>展开分组</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| callback | <code>function</code> | <p>操作完成时的回调函数</p> |


* * *

<a name="GroupList.collapse"></a>

### `GroupList.collapse(callback)` ⇒ <code>void</code>
<p>折叠分组</p>

**类型**: 静态方法(function)，来自 [<code>GroupList</code>](#GroupList)  
**简述**: <p>折叠分组</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| callback | <code>function</code> | <p>操作完成时的回调函数</p> |


* * *

<a name="Heading"></a>

## Heading ⇐ <code>PureComponent</code>
**类型**: 全局类(class)  
**简述**: <p>Heading 组件 ，显示一个支持带头像或操作的标题</p>.
**继承自 (extends)**: <code>PureComponent</code>
**参见**: https://react.docschina.org/docs/components-and-props.html

* [Heading](#Heading) ⇐ <code>PureComponent</code>
    * [`new Heading()`](#new_Heading_new)
    * [`.propTypes`](#Heading.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#Heading.defaultProps) : <code>object</code>


* * *

<a name="new_Heading_new"></a>

### `new Heading()`
<p>Heading 组件 ，显示一个支持带头像或操作的标题</p>

**示例**  
```jsx
<Heading />
```

* * *

<a name="Heading.propTypes"></a>

### `Heading.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>Heading</code>](#Heading)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="Heading.defaultProps"></a>

### `Heading.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>Heading</code>](#Heading)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="HotkeyInputControl"></a>

## HotkeyInputControl ⇐ <code>Component</code>
**类型**: 全局类(class)  
**简述**: <p>HotkeyInputControl 组件 ，显示一个快捷键输入框</p>.
**继承自 (extends)**: <code>Component</code>
**参见**: https://react.docschina.org/docs/components-and-props.html

* [HotkeyInputControl](#HotkeyInputControl) ⇐ <code>Component</code>
    * [`new HotkeyInputControl()`](#new_HotkeyInputControl_new)
    * [`.propTypes`](#HotkeyInputControl.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#HotkeyInputControl.defaultProps) : <code>object</code>
    * [`.changeValue(value, error)`](#HotkeyInputControl.changeValue) ⇒ <code>void</code>
    * [`.getValue()`](#HotkeyInputControl.getValue) ⇒ <code>string</code>


* * *

<a name="new_HotkeyInputControl_new"></a>

### `new HotkeyInputControl()`
<p>HotkeyInputControl 组件 ，显示一个快捷键输入框</p>

**示例**  
```jsx
<HotkeyInputControl />
```

* * *

<a name="HotkeyInputControl.propTypes"></a>

### `HotkeyInputControl.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>HotkeyInputControl</code>](#HotkeyInputControl)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="HotkeyInputControl.defaultProps"></a>

### `HotkeyInputControl.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>HotkeyInputControl</code>](#HotkeyInputControl)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="HotkeyInputControl.changeValue"></a>

### `HotkeyInputControl.changeValue(value, error)` ⇒ <code>void</code>
<p>更改输入框内的值</p>

**类型**: 静态方法(function)，来自 [<code>HotkeyInputControl</code>](#HotkeyInputControl)  
**简述**: <p>更改输入框内的值</p>.

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| value | <code>string</code> |  | <p>输入框内的值</p> |
| error | <code>String</code> \| <code>ReactNode</code> | <code></code> | <p>设置错误提示</p> |


* * *

<a name="HotkeyInputControl.getValue"></a>

### `HotkeyInputControl.getValue()` ⇒ <code>string</code>
<p>获取输入框内的值</p>

**类型**: 静态方法(function)，来自 [<code>HotkeyInputControl</code>](#HotkeyInputControl)  
**简述**: <p>获取输入框内的值</p>.

* * *

<a name="Icon"></a>

## Icon ⇐ <code>PureComponent</code>
**类型**: 全局类(class)  
**简述**: <p>Icon 组件 ，显示一个图标，目前支持 materialdesign 内的所有图标</p>.
**继承自 (extends)**: <code>PureComponent</code>
**参见**

- https://materialdesignicons.com/
- https://react.docschina.org/docs/components-and-props.html


* [Icon](#Icon) ⇐ <code>PureComponent</code>
    * [`new Icon()`](#new_Icon_new)
    * [`.propTypes`](#Icon.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#Icon.defaultProps) : <code>object</code>
    * [`.render(icon, props)`](#Icon.render) ⇒ <code>ReactNode.&lt;MDIcon&gt;</code>


* * *

<a name="new_Icon_new"></a>

### `new Icon()`
<p>Icon 组件 ，显示一个图标，目前支持 materialdesign 内的所有图标</p>

**示例** *(创建一个星星图标)*  
```js
<MDIcon name="star" />
```

* * *

<a name="Icon.propTypes"></a>

### `Icon.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>Icon</code>](#Icon)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="Icon.defaultProps"></a>

### `Icon.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>Icon</code>](#Icon)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="Icon.render"></a>

### `Icon.render(icon, props)` ⇒ <code>ReactNode.&lt;MDIcon&gt;</code>
<p>创建一个图标组件</p>

**类型**: 静态方法(function)，来自 [<code>Icon</code>](#Icon)  
**简述**: <p>创建一个图标组件</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| icon | <code>String</code> \| <code>ReactNode</code> \| <code>Object</code> | <p>图标名称或者图标组件属性配置</p> |
| props | <code>Object</code> | <p>图标组件属性配置</p> |

**示例** *(创建一个星星图标)*  
```js
const icon = MDIcon.render('star');
```

* * *

<a name="ImageCutter"></a>

## ImageCutter ⇐ <code>Component</code>
**类型**: 全局类(class)  
**简述**: <p>ImageCutter 组件 ，显示一个图片剪切控件</p>.
**继承自 (extends)**: <code>Component</code>
**参见**: https://react.docschina.org/docs/components-and-props.html

* [ImageCutter](#ImageCutter) ⇐ <code>Component</code>
    * [`new ImageCutter()`](#new_ImageCutter_new)
    * [`.propTypes`](#ImageCutter.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#ImageCutter.defaultProps) : <code>object</code>


* * *

<a name="new_ImageCutter_new"></a>

### `new ImageCutter()`
<p>ImageCutter 组件 ，显示一个图片剪切控件</p>

**示例**  
```jsx
<ImageCutter />
```

* * *

<a name="ImageCutter.propTypes"></a>

### `ImageCutter.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>ImageCutter</code>](#ImageCutter)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="ImageCutter.defaultProps"></a>

### `ImageCutter.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>ImageCutter</code>](#ImageCutter)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="ImageHolder"></a>

## ImageHolder ⇐ <code>PureComponent</code>
**类型**: 全局类(class)  
**简述**: <p>ImageHolder 组件 ，显示一个图片占位元素</p>.
**继承自 (extends)**: <code>PureComponent</code>
**参见**: https://react.docschina.org/docs/components-and-props.html

* [ImageHolder](#ImageHolder) ⇐ <code>PureComponent</code>
    * [`new ImageHolder()`](#new_ImageHolder_new)
    * [`.propTypes`](#ImageHolder.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#ImageHolder.defaultProps) : <code>object</code>


* * *

<a name="new_ImageHolder_new"></a>

### `new ImageHolder()`
<p>ImageHolder 组件 ，显示一个图片占位元素</p>

**示例**  
```jsx
<ImageHolder />
```

* * *

<a name="ImageHolder.propTypes"></a>

### `ImageHolder.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>ImageHolder</code>](#ImageHolder)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="ImageHolder.defaultProps"></a>

### `ImageHolder.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>ImageHolder</code>](#ImageHolder)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="InputControl"></a>

## InputControl ⇐ <code>PureComponent</code>
**类型**: 全局类(class)  
**简述**: <p>InputControl 组件 ，显示一个输入框控件</p>.
**继承自 (extends)**: <code>PureComponent</code>
**参见**: https://react.docschina.org/docs/components-and-props.html

* [InputControl](#InputControl) ⇐ <code>PureComponent</code>
    * [`new InputControl()`](#new_InputControl_new)
    * [`.propTypes`](#InputControl.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#InputControl.defaultProps) : <code>object</code>
    * [`.value`](#InputControl.value) : <code>string</code>
    * [`.focus()`](#InputControl.focus) ⇒ <code>void</code>


* * *

<a name="new_InputControl_new"></a>

### `new InputControl()`
<p>InputControl 组件 ，显示一个输入框控件</p>

**示例**  
```jsx
<InputControl />
```

* * *

<a name="InputControl.propTypes"></a>

### `InputControl.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>InputControl</code>](#InputControl)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="InputControl.defaultProps"></a>

### `InputControl.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>InputControl</code>](#InputControl)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="InputControl.value"></a>

### `InputControl.value` : <code>string</code>
<p>获取文本框值</p>

**类型**: 静态属性(property)，来自 [<code>InputControl</code>](#InputControl)  
**简述**: <p>获取文本框值</p>.

* * *

<a name="InputControl.focus"></a>

### `InputControl.focus()` ⇒ <code>void</code>
<p>激活输入框</p>

**类型**: 静态方法(function)，来自 [<code>InputControl</code>](#InputControl)  
**简述**: <p>激活输入框</p>.

* * *

<a name="ListItem"></a>

## ListItem ⇐ <code>PureComponent</code>
**类型**: 全局类(class)  
**简述**: <p>ListItem 组件 ，显示一个列表项</p>.
**继承自 (extends)**: <code>PureComponent</code>
**参见**: https://react.docschina.org/docs/components-and-props.html

* [ListItem](#ListItem) ⇐ <code>PureComponent</code>
    * [`new ListItem()`](#new_ListItem_new)
    * [`.propTypes`](#ListItem.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#ListItem.defaultProps) : <code>object</code>


* * *

<a name="new_ListItem_new"></a>

### `new ListItem()`
<p>ListItem 组件 ，显示一个列表项</p>

**示例**  
```jsx
<ListItem />
```

* * *

<a name="ListItem.propTypes"></a>

### `ListItem.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>ListItem</code>](#ListItem)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="ListItem.defaultProps"></a>

### `ListItem.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>ListItem</code>](#ListItem)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="Pager"></a>

## Pager ⇐ <code>PureComponent</code>
**类型**: 全局类(class)  
**简述**: <p>Pager 组件 ，显示一个分页控件</p>.
**继承自 (extends)**: <code>PureComponent</code>
**参见**: https://react.docschina.org/docs/components-and-props.html

* [Pager](#Pager) ⇐ <code>PureComponent</code>
    * [`new Pager()`](#new_Pager_new)
    * [`.propTypes`](#Pager.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#Pager.defaultProps) : <code>object</code>


* * *

<a name="new_Pager_new"></a>

### `new Pager()`
<p>Pager 组件 ，显示一个分页控件</p>

**示例**  
```jsx
<Pager />
```

* * *

<a name="Pager.propTypes"></a>

### `Pager.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>Pager</code>](#Pager)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="Pager.defaultProps"></a>

### `Pager.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>Pager</code>](#Pager)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="RadioGroup"></a>

## RadioGroup ⇐ <code>PureComponent</code>
**类型**: 全局类(class)  
**简述**: <p>RadioGroup 组件 ，显示一个单选组</p>.
**继承自 (extends)**: <code>PureComponent</code>
**参见**: https://react.docschina.org/docs/components-and-props.html

* [RadioGroup](#RadioGroup) ⇐ <code>PureComponent</code>
    * [`new RadioGroup()`](#new_RadioGroup_new)
    * [`.propTypes`](#RadioGroup.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#RadioGroup.defaultProps) : <code>object</code>


* * *

<a name="new_RadioGroup_new"></a>

### `new RadioGroup()`
<p>RadioGroup 组件 ，显示一个单选组</p>

**示例**  
```jsx
<RadioGroup />
```

* * *

<a name="RadioGroup.propTypes"></a>

### `RadioGroup.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>RadioGroup</code>](#RadioGroup)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="RadioGroup.defaultProps"></a>

### `RadioGroup.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>RadioGroup</code>](#RadioGroup)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="Radio"></a>

## Radio ⇐ <code>Component</code>
**类型**: 全局类(class)  
**简述**: <p>Radio 组件 ，显示一个单选控件</p>.
**继承自 (extends)**: <code>Component</code>
**参见**: https://react.docschina.org/docs/components-and-props.html

* [Radio](#Radio) ⇐ <code>Component</code>
    * [`new Radio()`](#new_Radio_new)
    * [`.propTypes`](#Radio.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#Radio.defaultProps) : <code>object</code>


* * *

<a name="new_Radio_new"></a>

### `new Radio()`
<p>Radio 组件 ，显示一个单选控件</p>

**示例**  
```jsx
<Radio />
```

* * *

<a name="Radio.propTypes"></a>

### `Radio.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>Radio</code>](#Radio)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="Radio.defaultProps"></a>

### `Radio.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>Radio</code>](#Radio)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="SearchControl"></a>

## SearchControl ⇐ <code>PureComponent</code>
**类型**: 全局类(class)  
**简述**: <p>SearchControl 组件 ，显示一个搜索框</p>.
**继承自 (extends)**: <code>PureComponent</code>
**参见**: https://react.docschina.org/docs/components-and-props.html

* [SearchControl](#SearchControl) ⇐ <code>PureComponent</code>
    * [`new SearchControl()`](#new_SearchControl_new)
    * [`.propTypes`](#SearchControl.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#SearchControl.defaultProps) : <code>object</code>
    * [`.getValue()`](#SearchControl.getValue) ⇒ <code>string</code>
    * [`.isEmpty()`](#SearchControl.isEmpty) ⇒ <code>boolean</code>
    * [`.setValue(value, callback)`](#SearchControl.setValue) ⇒ <code>void</code>


* * *

<a name="new_SearchControl_new"></a>

### `new SearchControl()`
<p>SearchControl 组件 ，显示一个搜索框</p>

**示例**  
```jsx
<SearchControl />
```

* * *

<a name="SearchControl.propTypes"></a>

### `SearchControl.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>SearchControl</code>](#SearchControl)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="SearchControl.defaultProps"></a>

### `SearchControl.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>SearchControl</code>](#SearchControl)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="SearchControl.getValue"></a>

### `SearchControl.getValue()` ⇒ <code>string</code>
<p>获取输入的值</p>

**类型**: 静态方法(function)，来自 [<code>SearchControl</code>](#SearchControl)  
**简述**: <p>获取输入的值</p>.

* * *

<a name="SearchControl.isEmpty"></a>

### `SearchControl.isEmpty()` ⇒ <code>boolean</code>
<p>检查搜索框是否为空</p>

**类型**: 静态方法(function)，来自 [<code>SearchControl</code>](#SearchControl)  
**简述**: <p>检查搜索框是否为空</p>.

* * *

<a name="SearchControl.setValue"></a>

### `SearchControl.setValue(value, callback)` ⇒ <code>void</code>
<p>设置搜索框值</p>

**类型**: 静态方法(function)，来自 [<code>SearchControl</code>](#SearchControl)  
**简述**: <p>设置搜索框值</p>.

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | <code>string</code> | <p>输入框值</p> |
| callback | <code>function</code> | <p>操作完成时的回调函数</p> |


* * *

<a name="SelectBox"></a>

## SelectBox ⇐ <code>Component</code>
**类型**: 全局类(class)  
**简述**: <p>SelectBox 组件 ，显示一个选择框</p>.
**继承自 (extends)**: <code>Component</code>
**参见**: https://react.docschina.org/docs/components-and-props.html

* [SelectBox](#SelectBox) ⇐ <code>Component</code>
    * [`new SelectBox()`](#new_SelectBox_new)
    * [`.propTypes`](#SelectBox.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#SelectBox.defaultProps) : <code>object</code>
    * [`.focus()`](#SelectBox.focus) ⇒ <code>void</code>


* * *

<a name="new_SelectBox_new"></a>

### `new SelectBox()`
<p>SelectBox 组件 ，显示一个选择框</p>

**示例**  
```jsx
<SelectBox />
```

* * *

<a name="SelectBox.propTypes"></a>

### `SelectBox.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>SelectBox</code>](#SelectBox)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="SelectBox.defaultProps"></a>

### `SelectBox.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>SelectBox</code>](#SelectBox)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="SelectBox.focus"></a>

### `SelectBox.focus()` ⇒ <code>void</code>
<p>使选择框获得焦点</p>

**类型**: 静态方法(function)，来自 [<code>SelectBox</code>](#SelectBox)  
**简述**: <p>使选择框获得焦点</p>.

* * *

<a name="Spinner"></a>

## Spinner ⇐ <code>PureComponent</code>
**类型**: 全局类(class)  
**简述**: <p>Spinner 组件 ，显示一个用于“正在加载中”图标</p>.
**继承自 (extends)**: <code>PureComponent</code>
**参见**: https://react.docschina.org/docs/components-and-props.html

* [Spinner](#Spinner) ⇐ <code>PureComponent</code>
    * [`new Spinner()`](#new_Spinner_new)
    * [`.propTypes`](#Spinner.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#Spinner.defaultProps) : <code>object</code>


* * *

<a name="new_Spinner_new"></a>

### `new Spinner()`
<p>Spinner 组件 ，显示一个用于“正在加载中”图标</p>

**示例**  
```jsx
<Spinner />
```

* * *

<a name="Spinner.propTypes"></a>

### `Spinner.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>Spinner</code>](#Spinner)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="Spinner.defaultProps"></a>

### `Spinner.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>Spinner</code>](#Spinner)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="TabPane"></a>

## TabPane ⇐ <code>PureComponent</code>
**类型**: 全局类(class)  
**简述**: <p>TabPane 组件 ，显示一个标签页内容控件</p>.
**继承自 (extends)**: <code>PureComponent</code>
**参见**: https://react.docschina.org/docs/components-and-props.html

* [TabPane](#TabPane) ⇐ <code>PureComponent</code>
    * [`new TabPane()`](#new_TabPane_new)
    * [`.propTypes`](#TabPane.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#TabPane.defaultProps) : <code>object</code>


* * *

<a name="new_TabPane_new"></a>

### `new TabPane()`
<p>TabPane 组件 ，显示一个标签页内容控件</p>

**示例**  
```jsx
<TabPane />
```

* * *

<a name="TabPane.propTypes"></a>

### `TabPane.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>TabPane</code>](#TabPane)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="TabPane.defaultProps"></a>

### `TabPane.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>TabPane</code>](#TabPane)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

<a name="Tabs"></a>

## Tabs ⇐ <code>PureComponent</code>
**类型**: 全局类(class)  
**简述**: <p>Tabs 组件 ，显示一个标签页控件</p>.
**继承自 (extends)**: <code>PureComponent</code>
**参见**: https://react.docschina.org/docs/components-and-props.html
**属性**

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| navClassName | <code>string</code> | <p>导航类名</p> |


* [Tabs](#Tabs) ⇐ <code>PureComponent</code>
    * [`new Tabs()`](#new_Tabs_new)
    * [.TabPane](#Tabs.TabPane)
        * [`new TabPane()`](#new_Tabs.TabPane_new)
    * [`.propTypes`](#Tabs.propTypes) ⇒ <code>Object</code>
    * [`.defaultProps`](#Tabs.defaultProps) : <code>object</code>


* * *

<a name="new_Tabs_new"></a>

### `new Tabs()`
<p>Tabs 组件 ，显示一个标签页控件</p>

**示例**  
```jsx
<Tabs />
```

* * *

<a name="Tabs.TabPane"></a>

### Tabs.TabPane
**类型**: 静态类(class)，来自 [<code>Tabs</code>](#Tabs)  
**简述**: <p>标签页面板组件</p>.

* * *

<a name="new_Tabs.TabPane_new"></a>

#### `new TabPane()`
<p>标签页面板组件</p>


* * *

<a name="Tabs.propTypes"></a>

### `Tabs.propTypes` ⇒ <code>Object</code>
<p>React 组件属性类型检查</p>

**类型**: 静态属性(property)，来自 [<code>Tabs</code>](#Tabs)  
**简述**: <p>React 组件属性类型检查</p>.
**参见**: https://react.docschina.org/docs/typechecking-with-proptypes.html

* * *

<a name="Tabs.defaultProps"></a>

### `Tabs.defaultProps` : <code>object</code>
<p>React 组件默认属性</p>

**类型**: 静态属性(property)，来自 [<code>Tabs</code>](#Tabs)  
**简述**: <p>React 组件默认属性</p>.
**参见**: https://react.docschina.org/docs/react-component.html#defaultprops

* * *

