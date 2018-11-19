# 项目源码结构

客户端项目源码在 [${repository.clientSourceRoot}](${repository.sourceUrl}${repository.clientSourceRoot}) 目录内，下文中涉及到目录和文件均是使用此路径作为根目录。

## app/

## package.json

[`package.json` 文件](https://docs.npmjs.com/files/package.json)位于 [${repository.clientSourceRoot}package.json](${repository.sourceUrl}${repository.clientSourceRoot}package.json)。此文件不仅仅是 npm 包定义文件还是喧喧客户端项目配置管理文件。

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

#### 开发依赖模块

开发过程中依赖的模块使用 `devDependencies` 字段指定。与应用依赖模块类似，该字段也指向一个对象，规则与 `dependencies` 对象相同。

如果开发中同时依赖了应用依赖模块 `dependencies` 字段中指定的模块，则不需要再次在 `devDependencies` 重复定义。

目前喧喧 `${version}` 版本中用到的开发依赖模块包括：

#### 可选依赖模块

可选依赖模块使用 `optionalDependencies` 字段指定，定义规则与应用依赖模块（`dependencies`）相同。

可选依赖模块适用于实现应用最终功能所需的模块，但应用依赖模块不同的是即便是安装失败或者对应的平台没有提供此模块的实现也不影响功能。

#### 运行时应用依赖模块

运行时应用依赖模块作为应用依赖模块的补充，模块文件不会打包进最终的 `bundle.js` 文件，会在 `${repository.clientSourceRoot}app/node_modules/` 文件夹中单独存放，此文件夹最终会存放在 `bundle.js` 所在的文件夹中，运行时应用依赖模块在 [运行时的 package.json 文件](#运行时的 package.json 文件) 中通过 `dependencies` 字段指定。

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

`scripts` 字段指定了运行脚本命令的 npm 命令行缩写，比如 start 指定了运行 npm run start时，所要执行的命令。

### package-lock.json 和 yarn.lock

### 运行时的 package.json 文件


## Webpack

### `.babelrc`

## 源码检查 ESLint

### `.eslintrc`

### `.eslintignore`

## 打包

### resources

### release

###

## 其他配置文件

### `.editorconfig`

### `.esdoc.json`