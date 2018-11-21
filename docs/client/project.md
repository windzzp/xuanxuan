# 项目文件结构

客户端项目文件在 [${repository.clientSourceRoot}](${repository.sourceUrl}${repository.clientSourceRoot}) 目录内，下文中涉及到目录和文件均是使用此路径作为根目录。

## 项目文件目录结构一览

版本库中包含的目录文件如下：

```txt
xxc/
 ├─ .vscode/               # Visual Studio Code 配置目录
 ├─ app/                   # 项目源码目录
 ├─ build/                 # 客户端打包脚本和配置目录
 ├─ examples/              # 客户端开发示例目录
 ├─ resources/             # 客户端打包资源文件目录
 ├─ tools/                 # 客户端开发工具脚本
 ├─ .babelrc               # Babel 配置文件
 ├─ .editorconfig          # 编辑器通用配置文件
 ├─ .esdoc.json            # ESDoc 文档生成配置文件
 ├─ .eslintignore          # ESLint 忽略清单
 ├─ .eslintrc              # ESLint 配置文件
 ├─ package-lock.json      # npm 模块版本锁定文件
 ├─ package.json           # npm 包描述文件
 ├─ README.md              # README 文件
 └─ yarn.lock              # yarn 版本锁定文件
```

在开发的过程中还会自动生成一些不在版本库中的目录和文件：

```txt
xxc/
 ├─ node_modules/         # npm 缓存的模块目录
 └─ release/              # 存储执行打包操作生成的安装包
```

## 应用源码目录 app/

客户端应用源码目录为 [${repository.clientSourceRoot}app/](${repository.sourceUrl}${repository.clientSourceRoot}app/)。下面为该目录下各个子目录和文件作用。

### 版本库中的文件和目录

* `assets/`：包含界面上用到的静态第三方资源；
* `build-in/`：内置的扩展配置和扩展包；
* `components/`：包含喧喧用到的通用 React 组件；
* `config/`：包含运行时配置项；
* `core/`：喧喧核心功能模块，包含事件机制、界面管理、网络、用户资料、数据库、聊天功能等子模块；
* `exts/`：实现扩展机制模块；
* `lang/`：管理界面上的语言文本；
* `meida/`：界面上使用到的媒体资源，包括图片、音频和表情资源；
* `platform/`：平台相关模块，目前包含浏览器平台和 Electron 平台；
* `style/`：界面上用到的 CSS 样式，大部分为 Less 格式；
* `utils/`：工具模块；
* `views/`：界面模块，大部分为 React 组件形式；
* `index.html`：Electron 渲染进程加载的 HTML 文件；
* `index.js`：Electron 渲染进程窗口在 `index.html` 文件中加载 JS 文件；
* `main.development.js`：Electron 主进程入口文件；
* `package.json`：Electron 加载的 package.json （运行时包配置）文件；
* `yarn.lock`：yarn 的版本锁定文件；
* `package-lock.json`：npm 的版本锁定文件。

### 开发过程中的文件和目录

在开发的过程中还会在项目源码目录生成一些不在版本库中的目录和文件：

* `dist/`：执行打包过程中 Webpack 生成的临时文件；
* `media-build/`：执行自定义打包过程中生成媒体资源临时文件；
* `node_modules/`：运行时的依赖模块模块；
* `web-dist/`：执行打包浏览器端版本时生成的临时文件；
* `main.js`：执行打包或启动调试模式时生成的 Electron 入口文件；
* `main.js.map`：`main.js` 的源码 Map 文件；
* `manifest.json`：执行打包浏览器端版本时生成的 PWA 描述文件。

## package.json

[`package.json` 文件](https://docs.npmjs.com/files/package.json)位于 [${repository.clientSourceRoot}package.json](${repository.sourceUrl}${repository.clientSourceRoot}package.json)。此文件不仅仅是 npm 包定义文件，还是喧喧客户端项目配置管理文件。

当前项目中 `package.json` 文件主要包括如下内容：

```json
{
    // 项目名称
    "name": "${name}",

    // 项目产品名称
    "productName": "${displayName}",

    // 当前发行的版本
    "version": "${version}",

    // 项目描述
    "description": "${description}",

    // 项目相关 npm 脚本命令，详情参见下文 “npm 命令 `scripts`” 章节
    "scripts": {},

    // electron-builder 配置文件信息
    "build": {},

    // 指定各个内部命令对应的可执行文件的位置
    "bin": {},

    // 项目版本库信息
    "repository": {
      "type": "${repository.type}",
      "url": "${repository.url}"
    },

    // 项目作者信息
    "author": {
      "name": "${author.name}",
      "email": "${author.email}"
    },

    // 项目开源许可协议
    "license": "${license}",

    // Bugs 反馈信息
    "bugs": {"url": "${bugs.url}"},

    // 项目关键字
    "keywords": [ "im", "message", "electron", "react", "webpack", "react-hot"],

    // 项目主页
    "homepage": "${homepage}",

    // 项目所属公司
    "company": "${company}",

    // 开发依赖模块，详情参考 “开发依赖模块 `devDependencies`” 章节
    "devDependencies": {},

    // 应用依赖模块，详情参考 “应用依赖模块 `dependencies`” 章节
    "dependencies": {},

    // 可选依赖模块，详情参考 “可选依赖模块 `optionalDependencies`” 章节
    "optionalDependencies": {},

    // 开发环境版本约束
    "devEngines": {}
}
```

!> 在目前普遍使用的 JSON 语言版本中不允许使用 `// comment` 来添加注释，实际使用时，应该将以上示例内容中的注释内容去掉。

### 依赖模块

喧喧客户端依赖模块包括应用依赖模块、开发依赖模块、可选依赖模块和运行时应用依赖模块。

#### 应用依赖模块

[`dependencies`](https://docs.npmjs.com/files/package.json#dependencies) 字段指定了应用运行所依赖的模块。该字段指向一个对象，该对象属性和对应的值，分别由模块名和对应的版本限定描述组成。版本限定描述规则参考 [https://docs.npmjs.com/files/package.json#dependencies](https://docs.npmjs.com/files/package.json#dependencies)。

应用依赖模块适用于实现应用最终功能所需要的模块，这些模块会通过 Webpack 打包进最终 `bundle.js` 文件中。

目前喧喧 `${version}` 版本中用到的应用依赖模块包括：

| 模块名称 | 版本 | 说明 | 使用该模块的平台 | 许可协议 |
| -------- | ---- | ---- | ---- | ---- |
|[`aes-js`](https://www.npmjs.com/package/aes-js) | `^3.1.0` | AES 加密解密算法的 JS 实现 | 浏览器 | MIT |
|[`cheerio`](https://www.npmjs.com/package/cheerio) | `^1.0.0-rc.2` | 类 jQuery API 在 Node.js 上的实现 | Electron | MIT |
|[`clipboard-js`](https://www.npmjs.com/package/clipboard-js) | `^0.3.5` | 提供在浏览器上读写剪切板的 API | 浏览器端 | MIT |
|[`compare-versions`](https://www.npmjs.com/package/compare-versions) | `^3.1.0` | 比较版本号工具模块 | Electron、浏览器端 | MIT |
|[`dexie`](https://www.npmjs.com/package/dexie) | `^2.0.4` | IndexDB 数据库包装模块 | Electron、浏览器端 | Apache-2.0 |
|[`draft-js`](https://www.npmjs.com/package/draft-js) | `^0.10.5` | 富文本编辑器组件 | Electron、浏览器端 | BSD-3-Clause |
|[`electron-debug`](https://www.npmjs.com/package/electron-debug) | `^2.0.0` | 为 Electron 增加一些调试特性 | Electron | MIT |
|[`emojione`](https://www.npmjs.com/package/emojione) | `^3.1.7` | Emojione 实现的 Emoji 表情转换模块 | Electron、浏览器端 | MIT |
|[`emojione-picker`](https://www.npmjs.com/package/emojione-picker) | `^2.1.2` | Emojione 表情选择面板组件 | Electron、浏览器端 | MIT |
|[`extract-zip`](https://www.npmjs.com/package/extract-zip) | `^1.6.6` | zip 文件解压模块 | Electron | BSD-2-Clause |
|[`fs-extra`](https://www.npmjs.com/package/fs-extra) | `^7.0.0` | Node.js 内置 `fs` 模块端 Promise 实现 | Electron | MIT |
|[`highlight.js`](https://www.npmjs.com/package/highlight.js) | `^9.9.0` | 代码文本高亮转换模块 | Electron、浏览器端 | BSD-3-Clause |
|[`hotkeys-js`](https://www.npmjs.com/package/hotkeys-js) | `^3.3.5` | 界面快捷键管理模块 | Electron、浏览器端 | MIT |
|[`htmlparser`](https://www.npmjs.com/package/htmlparser) | `^1.7.7` | HTML 快速解析模块 | Electron、浏览器端 | MIT |
|[`ion-sound`](https://www.npmjs.com/package/ion-sound) | `^3.0.7` | 音频文件播放控制模块 | Electron、浏览器端 | MIT |
|[`marked`](https://www.npmjs.com/package/marked) | `^0.4.0` | Markdown 模块 | Electron、浏览器端 | MIT |
|[`md5`](https://www.npmjs.com/package/md5) | `^2.2.1` | MD5 算法实现模块 | Electron、浏览器端 | BSD-3-Clause |
|[`pinyin`](https://www.npmjs.com/package/pinyin) | `^2.8.3` | 汉字转拼音模块 | Electron、浏览器端 | MIT |
|[`prop-types`](https://www.npmjs.com/package/prop-types) | `^15.6.2` | React 属性类型检查模块 | Electron、浏览器端 |
|[`react`](https://www.npmjs.com/package/react) | `^16.4.1` | React 用户界面框架 | Electron、浏览器端 | MIT |
|[`react-dom`](https://www.npmjs.com/package/react-dom) | `^16.4.1` | React 用户界面框架 | Electron、浏览器端 | MIT |
|[`react-router-dom`](https://www.npmjs.com/package/react-router-dom) | `^4.2.2` | React 路由组件 | Electron、浏览器端 | MIT |
|[`react-split-pane`](https://www.npmjs.com/package/react-split-pane) | `^0.1.66` | 分栏组件 | Electron、浏览器端 | MIT |
|[`recordrtc`](https://www.npmjs.com/package/recordrtc) | `^5.4.0` | 使用 WebRTC 录屏模块（用于 Electron 截图功能） |  MIT |Electron |
|[`remove-markdown`](https://www.npmjs.com/package/remove-markdown) | `^0.3.0` | Markdown 转纯文本模块 | Electron、浏览器端 | MIT |
|[`source-map-support`](https://www.npmjs.com/package/source-map-support) | `^0.5.6` | Source map 支持模块 | Electron、浏览器端 | MIT |
|[`uuid`](https://www.npmjs.com/package/uuid) | `^3.1.0` | RFC4122 UUID 生成工具 | Electron、浏览器端 | MIT |
|[`wolfy87-eventemitter`](https://www.npmjs.com/package/wolfy87-eventemitter) | `^5.2.2` | 类 Node.js 事件触发器（EventEmitter）在浏览器端的实现 | 浏览器端 | Unlicense |
|[`ws`](https://www.npmjs.com/package/ws) | `^2.2.3` | WebSocket 在 Node.js 上的实现 | Electron | MIT |

#### 开发依赖模块

开发过程中依赖的模块使用 `devDependencies` 字段指定。与应用依赖模块类似，该字段也指向一个对象，规则与 `dependencies` 对象相同。

如果开发中同时依赖了应用依赖模块 `dependencies` 字段中指定的模块，则不需要再次在 `devDependencies` 重复定义。

目前喧喧 `${version}` 版本中用到的开发依赖模块包括：

| 模块名称 | 版本 | 说明 | 许可协议 |
| -------- | ---- | ---- | ---- |
|[`archiver`](https://www.npmjs.com/package/archiver) | `^3.0.0` | 压缩文件生成工具 | MIT |
|[`asar`](https://www.npmjs.com/package/asar) | `^0.14.3` | Electron ASAR 文件生成工具 | MIT |
|[`babel-core`](https://www.npmjs.com/package/babel-core) | `^6.26.3` | Babel 核心模块 | MIT |
|[`babel-eslint`](https://www.npmjs.com/package/babel-eslint) | `^8.2.6` | Babel Eslint 模块 | MIT |
|[`babel-loader`](https://www.npmjs.com/package/babel-loader) | `^7.1.5` | Webpack 的 Babel 加载器 | MIT |
|[`babel-plugin-add-module-exports`](https://www.npmjs.com/package/babel-plugin-add-module-exports) | `^0.2.1` | Babel 的 add-module-exports 插件|
|[`babel-plugin-dev-expression`](https://www.npmjs.com/package/babel-plugin-dev-expression) | `^0.2.1` | Babel 的 dev-expression 插件 | BSD-3-Clause |
|[`babel-plugin-module-resolver`](https://www.npmjs.com/package/babel-plugin-module-resolver) | `^3.1.1` | Babel 的 module-resolver 插件 | MIT |
|[`babel-plugin-tcomb`](https://www.npmjs.com/package/babel-plugin-tcomb) | `^0.3.24` | Babel 的 tcomb 插件 | MIT |
|[`babel-plugin-transform-class-properties`](https://www.npmjs.com/package/babel-plugin-transform-class-properties) | `^6.22.0` | Babel 的 transform-class-properties 插件 | MIT |
|[`babel-plugin-transform-es2015-classes`](https://www.npmjs.com/package/babel-plugin-transform-es2015-classes) | `^6.23.0` | Babel 的 transform-es2015-classes 插件 | MIT |
|[`babel-plugin-webpack-loaders`](https://www.npmjs.com/package/babel-plugin-webpack-loaders) | `^0.9.0` | Babel 的 webpack-loaders 插件 | MIT |
|[`babel-polyfill`](https://www.npmjs.com/package/babel-polyfill) | `^6.20.0` | Babel polyfill 模块 | MIT |
|[`babel-preset-env`](https://www.npmjs.com/package/babel-preset-env) | `^1.1.4` | Babel 预设配置 env | MIT |
|[`babel-preset-react`](https://www.npmjs.com/package/babel-preset-react) | `^6.16.0` | Babel 预设配置 react | MIT |
|[`babel-preset-react-hmre`](https://www.npmjs.com/package/babel-preset-react-hmre) | `^1.1.1` | Babel 预设配置 react-hmre | ISC |
|[`babel-preset-react-optimize`](https://www.npmjs.com/package/babel-preset-react-optimize) | `^1.0.1` | Babel 预设配置 react-optimize | MIT |
|[`babel-preset-stage-0`](https://www.npmjs.com/package/babel-preset-stage-0) | `^6.16.0` | Babel 预设配置 stage-0 | MIT |
|[`babel-register`](https://www.npmjs.com/package/babel-register) | `^6.18.0` | babel-register 模块 | MIT |
|[`babel-traverse`](https://www.npmjs.com/package/babel-traverse) | `^6.22.1` | babel-traverse 模块 | MIT |
|[`babili-webpack-plugin`](https://www.npmjs.com/package/babili-webpack-plugin) | `^0.1.2` | Babel minify 的 Webpack 插件 | MIT |
|[`chalk`](https://www.npmjs.com/package/chalk) | `^2.4.1` | 控制台输出美化插件 | MIT |
|[`commander`](https://www.npmjs.com/package/commander) | `^2.19.0` | 控制台脚本参数解析模块 | MIT |
|[`concurrently`](https://www.npmjs.com/package/concurrently) | `^3.1.0` | 命令行脚本并发执行模块 | MIT |
|[`cpx`](https://www.npmjs.com/package/cpx) | `^1.5.0` | Node.js 文件拷贝模块 | MIT |
|[`cross-env`](https://www.npmjs.com/package/cross-env) | `^5.2.0` | 跨平台环境变量设置模块 | MIT |
|[`css-loader`](https://www.npmjs.com/package/css-loader) | `^1.0.0` | Webpack 的 CSS 加载器 | MIT |
|[`devtron`](https://www.npmjs.com/package/devtron) | `^1.4.0` | Electron 开发者工具插件 | MIT |
|[`electron`](https://www.npmjs.com/package/electron) | `^2.0.5` | Electron 模块 | MIT |
|[`electron-builder`](https://www.npmjs.com/package/electron-builder) | `20.24.4` | Electron 打包工具模块 | MIT |
|[`electron-devtools-installer`](https://www.npmjs.com/package/electron-devtools-installer) | `^2.2.4` | Electron 开发者工具安装器 | MIT |
|[`esdoc`](https://www.npmjs.com/package/esdoc) | `^1.1.0` | ESDoc 文档生成模块 | MIT |
|[`esdoc-ecmascript-proposal-plugin`](https://www.npmjs.com/package/esdoc-ecmascript-proposal-plugin) | `^1.0.0` | ESDoc 的 ecmascript-proposal 插件 | MIT |
|[`esdoc-inject-script-plugin`](https://www.npmjs.com/package/esdoc-inject-script-plugin) | `^1.0.0` | ESDoc 的 inject-script 插件 | MIT |
|[`esdoc-inject-style-plugin`](https://www.npmjs.com/package/esdoc-inject-style-plugin) | `^1.0.0` | ESDoc 的 inject-style 插件 | MIT |
|[`esdoc-jsx-plugin`](https://www.npmjs.com/package/esdoc-jsx-plugin) | `^1.0.0` | ESDoc 的 jsx 插件 | MIT |
|[`esdoc-react-plugin`](https://www.npmjs.com/package/esdoc-react-plugin) | `^1.0.1` | ESDoc 的 react 插件 | MIT |
|[`esdoc-standard-plugin`](https://www.npmjs.com/package/esdoc-standard-plugin) | `^1.0.0` | ESDoc 的 standard 插件 | MIT |
|[`eslint`](https://www.npmjs.com/package/eslint) | `^5.9.0` | ESLint JS 语法和格式检查模块 | MIT |
|[`eslint-config-airbnb`](https://www.npmjs.com/package/eslint-config-airbnb) | `^17.0.0` | ESLint 的 airbnb 配置 | MIT |
|[`eslint-import-resolver-babel-module`](https://www.npmjs.com/package/eslint-import-resolver-babel-module) | `^4.0.0-beta.3` | ESLint 的 import-resolver-babel 模块 | MIT |
|[`eslint-import-resolver-webpack`](https://www.npmjs.com/package/eslint-import-resolver-webpack) | `^0.10.1` | ESLint 的 import-resolver-webpack 模块 | MIT |
|[`eslint-plugin-compat`](https://www.npmjs.com/package/eslint-plugin-compat) | `^2.5.1` | ESLint 的 compat 插件 | MIT |
|[`eslint-plugin-import`](https://www.npmjs.com/package/eslint-plugin-import) | `^2.13.0` | ESLint 的 import 插件 | MIT |
|[`eslint-plugin-jest`](https://www.npmjs.com/package/eslint-plugin-jest) | `^21.18.0` | ESLint 的 jest 插件 | MIT |
|[`eslint-plugin-jsx-a11y`](https://www.npmjs.com/package/eslint-plugin-jsx-a11y) | `6.1.1` | ESLint 的 jsx-a11y 插件 | MIT |
|[`eslint-plugin-promise`](https://www.npmjs.com/package/eslint-plugin-promise) | `^3.8.0` | ESLint 的 promise 插件 | ISC |
|[`eslint-plugin-react`](https://www.npmjs.com/package/eslint-plugin-react) | `^7.10.0` | ESLint 的 react 插件 | MIT |
|[`express`](https://www.npmjs.com/package/express) | `^4.14.0` | Node.js Web 服务模块 | MIT |
|[`extract-text-webpack-plugin`](https://www.npmjs.com/package/extract-text-webpack-plugin) | `^4.0.0-beta.0` | Webpack 的 extract-text 插件 | MIT |
|[`fbjs-scripts`](https://www.npmjs.com/package/fbjs-scripts) | `^0.8.3` | fbjs 工具模块 | MIT |
|[`file-loader`](https://www.npmjs.com/package/file-loader) | `^1.1.11` | Webpack 的文件加载器 | MIT |
|[`gh-pages`](https://www.npmjs.com/package/gh-pages) | `^1.0.0` | Github Pages 辅助发布模块 | MIT |
|[`html-webpack-plugin`](https://www.npmjs.com/package/html-webpack-plugin) | `^3.2.0` | Webpack 的 html 插件 | MIT |
|[`json-loader`](https://www.npmjs.com/package/json-loader) | `^0.5.7` | Webpack 的 JSON 文件加载器 | MIT |
|[`less`](https://www.npmjs.com/package/less) | `^3.7.1` | Less 模块 | Apache-2.0 |
|[`less-loader`](https://www.npmjs.com/package/less-loader) | `^4.1.0` | Webpack 的 Less 文件加载器 | MIT |
|[`minimist`](https://www.npmjs.com/package/minimist) | `^1.2.0` | 脚本参数解析模块 | MIT |
|[`opn`](https://www.npmjs.com/package/opn) | `^5.4.0` | Node.js 使用系统应用打开网址功能模块 | MIT |
|[`style-loader`](https://www.npmjs.com/package/style-loader) | `^0.21.0` | Webpack 的样式加载器 | MIT |
|[`uglifyjs-webpack-plugin`](https://www.npmjs.com/package/uglifyjs-webpack-plugin) | `^1.2.7` | Webpack 的 JS 压缩插件 | MIT |
|[`url-loader`](https://www.npmjs.com/package/url-loader) | `^1.0.1` | Webpack 的 url 加载器 | MIT |
|[`webpack`](https://www.npmjs.com/package/webpack) | `^4.16.1` | Webpack 模块 | MIT |
|[`webpack-cli`](https://www.npmjs.com/package/webpack-cli) | `^3.1.0` | Webpack 命令行程序模块 | MIT |
|[`webpack-dev-middleware`](https://www.npmjs.com/package/webpack-dev-middleware) | `^3.1.3` | Webpack 开发中间件 | MIT |
|[`webpack-hot-middleware`](https://www.npmjs.com/package/webpack-hot-middleware) | `^2.22.3` | Webpack 的热更新中间件 | MIT |
|[`webpack-merge`](https://www.npmjs.com/package/webpack-merge) | `^4.1.3` | Webpack 配置合并模块 | MIT |
|[`why-did-you-update`](https://www.npmjs.com/package/why-did-you-update) | `^0.1.1` | React 性能调试模块 | MIT |

#### 可选依赖模块

可选依赖模块使用 `optionalDependencies` 字段指定，定义规则与应用依赖模块（`dependencies`）相同。

可选依赖模块适用于实现应用最终功能所需的模块，但应用依赖模块不同的是即便是安装失败或者对应的平台没有提供此模块的实现也不影响功能。目前喧喧 `${version}` 版本中用到的可选依赖模块包括：

| 模块名称 | 版本 | 说明 | 许可协议 |
| -------- | ---- | ---- | ---- |
| [`bufferutil`](https://www.npmjs.com/package/bufferutil) | `^4.0.0` | `ws` 模块使用的工具模块 | MIT |
| [`utf-8-validate`](https://www.npmjs.com/package/utf-8-validate) | `^5.0.1` | utf-8 Buffer 检查模块 | MIT |

#### 运行时应用依赖模块

运行时应用依赖模块作为应用依赖模块的补充，模块文件不会打包进最终的 `bundle.js` 文件，会在 `${repository.clientSourceRoot}app/node_modules/` 文件夹中单独存放，此文件夹最终会存放在 `bundle.js` 所在的文件夹中，运行时应用依赖模块在 [运行时的 package.json 文件](#运行时的 package.json 文件) 中通过 `dependencies` 字段指定。目前喧喧 `${version}` 版本中用到的运行时应用依赖模块包括：

| 模块名称 | 版本 | 说明 | 许可协议 |
| -------- | ---- | ---- | ---- |
| [`jquery`](https://www.npmjs.com/package/jquery) | `^3.3.1` | jQuery 主要提供给扩展机制，方便扩展操作界面 DOM | MIT |

#### 安装依赖模块

首次准备开发环境时，需要安装依赖模块。应用依赖模块、开发依赖模块、可选依赖模块可以通过在项目目录（`${repository.clientSourceRoot}`）执行如下命令安装：

```bash
$ npm install
```

yarn 版本命令为：

```bash
$ yarn
```

运行时应用依赖模块需要进入 `${repository.clientSourceRoot}/app` 目录执行 `npm install` 或 `yarn` 命令。详细安装过程参考 [“客户端环境搭建”](client/start.md) 文档。

### npm 命令 scripts

`scripts` 字段指定了运行脚本命令的 npm 命令行缩写，比如 start 指定了运行 `npm run start` 时，所要执行的命令。目前包含如下命令：

| 命令 | 说明 |
| -------- | ---- |
| `npm run hot-server` | 启动桌面客户端 热更新服务器 |
| `npm run build-main` | 使用 Webpack 编译 Electron 主进程 JS 文件 |
| `npm run build-renderer` | 使用 Webpack 编译 Electron 渲染进程 JS 文件 |
| `npm run build-renderer-debug` | 使用 Webpack 编译 Electron 渲染进程启动 DEBUG 模式的 JS 文件 |
| `npm run build-main-debug` | 使用 Webpack 编译 Electron 主进程启动 DEBUG 模式的 JS 文件 |
| `npm run build` | 使用 Webpack 编译 Electron 主进程和渲染进程的 JS 文件 |
| `npm run build-debug` | 使用 Webpack 编译 Electron 主进程和渲染进程启动 DEBUG 模式的 JS 文件 |
| `npm run build-browser` | 使用 Webpack 编译浏览器端使用的 JS 文件 |
| `npm run start` | 启动浏览器端热更新服务器且在浏览器中打开浏览器端调试版本，相当于 `npm run hot-server-browser` |
| `npm run start-hot` | 启动客户端调试模式 |
| `npm run start-hot-fast` | 启动客户端调试模式但略过安装 Electron 开发者工具扩展 |
| `npm run postinstall` |  在 `npm install` 命令后执行的项目初始化脚本 |
| `npm run package` | 执行打包客户端命令 |
| `npm run package-beta` | 执行打包 Beta 版客户端命令 |
| `npm run package-debug` | 执行打包调试版客户端命令 |
| `npm run package-mac` | 执行打包 Mac 版本客户端命令 |
| `npm run package-mac-debug` | 执行打包 Mac 版本调试版客户端命令 |
| `npm run package-win` | 执行打包 Windows 64 位版本客户端命令 |
| `npm run package-win-32` | 执行打包 Windows 32 位版本客户端命令 |
| `npm run package-win-all` | 执行打包 Windows 64 位和 32 位版本客户端命令 |
| `npm run package-linux` | 执行打包 Linux 64 位版本客户端命令 |
| `npm run package-linux-32` | 执行打包 Linux 32 位版本客户端命令  |
| `npm run package-win-debug` | 执行打包 Windows 64 位调试版本命令 |
| `npm run package-all` | 执行打包所有类型客户端版本 |
| `npm run package-all-beta` | 执行打包所有类型客户端的 Beta 版本 |
| `npm run package-browser` | 执行打包浏览器端部署包版本 |
| `npm run hot-server-browser` | 启动浏览器端热更新服务器且在浏览器中打开浏览器端调试版本 |
| `npm run docs` | 执行生成项目文档命令 |
| `npm run eslint` | 执行 ESLint 源代码检查命令 |

?> 打包相关功能参考 [客户端打包文档](client/package.md)。

### package-lock.json 和 yarn.lock

`package-lock.json` 文件用于锁定首次执行 `npm install` 依赖的各个模块版本，使得喧喧客户端项目在不同的开发环境中所安装的依赖模块保持一致。`yarn.lock` 文件作用与 `package-lock.json` 作用相同，对应使用 `yarn` 代替 `npm` 作为包管理工具的情况。

!> 当安装了新的依赖模块或者升级了某些依赖模块会自动修改 `package-lock.json` 或 `yarn.lock` 文件，此时应该将此文件的修改提交到版本库。

### 运行时的 package.json 文件

`app/package.json` 文件作为 Electron 客户端运行时要加载的描述文件。此文件中的 `main` 字段指定了 Electron 主进程要加载的 JS 脚本，其他字段则描述应用程序相关信息。总体而言，除了 `main` 字段，其他字段含义与[项目 `package.json`](#package.json) 文件保持一致。此文件最终会随着打包过程拷贝到 Electron 所使用的 `app.asar` 文件包中来发布。下面为当前所使用的 `app/package.json`：

```json
{
    // 项目名称
    "name": "${name}",

    // 项目产品名称
    "productName": "${displayName}",

    // 当前发行的版本
    "version": "${version}",

    // 项目描述
    "description": "${description}",

    // Electron 主进程 JS 入口文件
    "main": "./main.js",

    // 项目版本库信息
    "repository": {
      "type": "${repository.type}",
      "url": "${repository.url}"
    },

    // 项目作者信息
    "author": {
      "name": "${author.name}",
      "email": "${author.email}"
    },

    // 项目开源许可协议
    "license": "${license}",

    // Bugs 反馈信息
    "bugs": {"url": "${bugs.url}"},

    // 项目关键字
    "keywords": [ "im", "message", "electron", "react", "webpack", "react-hot"],

    // 项目主页
    "homepage": "${homepage}",

    // 项目所属公司
    "company": "${company}",

    // 应用运行时依赖模块，参考 “运行时应用依赖模块” 章节
    "dependencies": {},
}
```

关于 Electron 应用使用 `package.json` 文件参考 [Electron 应用结构文档](https://electronjs.org/docs/tutorial/application-architecture#electron-%E5%BA%94%E7%94%A8%E7%BB%93%E6%9E%84)。

## Webpack

项目中使用到了 Webpack 作为前端静态资源打包工具。关于 Webpack 的详细使用参考官方文档：[https://webpack.docschina.org/](https://webpack.docschina.org/)。下面仅说明项目中 Webpack 相关配置项。

### Webpack 配置文件

Webpack 配置文件在 `app/tools/` 目录中，共包含如下几个功能不同的配置文件以实现不同的打包目标：

* `webpack.config.base.js`：包含一些公共的基础配置项，这些配置供其他配置文件作为基础配置使用；
* `webpack.config.browser.js`：作为浏览器端版本打包配置；
* `webpack.config.electron.js`：作为 Electron 主进程入口 JS  文件打包配置；
* `webpack.config.production.js`：作为 Electron 渲染进程 `index.html` 页面中引入的 JS 文件打包配置；
* `webpack.config.browser.development.js`：作为浏览器端调试模式下热更新服务打包配置；
* `webpack.config.development.js`：作为 Electron 渲染进程在调试模式下热更新服务打包配置。

### 热更新服务器

在 `app/tools/` 目录中还包括了一个名为 `server.js` 的脚本。此脚本用于启动客户端调试模式下的热更新服务器。

想了解热更新服务器的使用参考“[环境搭建](client/start?id=启动热更新服务器)”文档。

### Babel 和 `.babelrc`

项目源码中用到了大量下一代 JavaScript 语法（[ECMAScript 2015](https://babeljs.io/docs/en/learn)），例如箭头函数、模版字符串等。要使得这些语法特性在浏览器中能够正常使用，需要先转换为适合大部分浏览器环境能够理解的语法。Babel 是解决此问题的最好工具。在项目中 Babel 语法转换使用 Webpack 的 Babel JS 文件加载器实现。所有 Babel 工具使用到的配置在 `.babelrc` 文件中。关于此文件的更多说明参考 [https://babeljs.io/docs/en/config-files](https://babeljs.io/docs/en/config-files)。

## 源码检查 ESLint

项目中使用 [ESLint](https://cn.eslint.org/) 来检查代码中的语法错误以及规范代码格式。项目中的 ESLint 用到了两个配置文件：

* `.eslintrc`：用于配置 ESLint 规则；
* `.eslintignore`：用于配置哪些文件应该被忽略。

有两种方法来在项目进行 ESLint 验证：

* 方法一：运行 `npm run eslint` 命令，会在命令行界面上输出检查结果；
* 方法二（推荐）：在使用 [Visual Studio Code](https://code.visualstudio.com/) 的情况下只需要安装 [ESLint 扩展](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)即可在源代码编辑界面上直接看到验证结果。

## 客户端打包相关

客户端打包用到了如下三个子目录：

* `build/`：包含了打包脚本和相关配置，该目录内的 `package.js` 是打包命令 `npm run package` 的执行脚本，`electron-builder.json` 文件是 electron-builder 的配置文件，改文件通常会自动生成；
* `resources/`：包含了制作各个平台桌面版安装包过程中需要的程序图标等资源文件；
* `release/`：该目录不在版本库中，但当执行打包命令 `npm run package` 时，会将生成的安装包存放在此目录中；

想了解更多关于关于客户端打包请参考“[客户端打包](client/package.md)”文档。

## 其他配置文件

### `.editorconfig`

`.editorconfig` 用于约定代码中编辑器中的基本格式设置，这些设置在几乎所有编辑器中都会自动应用。关于 EditorConfig 参考 [https://editorconfig.org/](https://editorconfig.org/)。

### `.esdoc.json`

[项目 API 文档](client/api.md)使用 [ESDoc](https://esdoc.org/) 根据项目源码中的注释自动生成。`.esdoc.json` 是 ESDoc 的[配置文件](https://esdoc.org/manual/config.html)。

要生成项目 API 文档只需要执行：

```bash
$ npm run docs
```