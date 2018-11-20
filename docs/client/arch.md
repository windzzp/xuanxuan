# 客户端架构

本文主要讲述客户端开发所使用到的技术，关键模块以及项目源码结构。

## 实现技术

喧喧是一个开源的企业即时通讯解决方案，官方客户端的实现主要遵从如下目标：

1. **尽可能支持更多平台**：客户端应该能够在 Windows、Mac 和 Linux 等多个平台上运行，并且容易迁移到其他平台上；
2. **使用开源依赖模块**：除非用户自己定制的部分，客户端所使用的框架和依赖模块都应该来自于同样使用开源许可协议的项目；
3. **易于进行二次开发**：用户能够非常容易的理解喧喧客户端所使用的技术，非常方便的利用流行技术进行二次开发。

根据上述目标，喧喧客户端主要使用到了如下关键技术：

* **HTML/JS/CSS**：借助 HTML/JS/CSS 技术来实现美观易用的现代化界面和交互逻辑，可以非常方便的让喧喧运行在任何浏览器环境或者类浏览器环境（例如 [Electron](https://electronjs.org/) 或 [NWJS](https://nwjs.io/)）；
* **Electron**：[Electron](https://electronjs.org/) 结合了 Node.js 和 Chrome 运行环境，为跨平台应用提供了功能强大的框架，借助 Electron，喧喧桌面端版本在 Windows、Mac 和 Linux 保证拥有相同的完整到功能体验；
* **Node.js**：Electron 在应用运行时提供了 [Node.js](https://nodejs.org/zh-cn/) 运行环境，使得桌面版可以访问桌面操作系统原生功能，同时 Node.js 环境还是项目开发时辅助工具脚本的运行环境；
* **npm**：[npm](https://www.npmjs.com/) 作为项目到包管理工具，是进行 Node.js 开发的不二之选，同时 [npm 网站](https://www.npmjs.com/)上拥有世界上最大到软件注册表，可以非常方便的获取第三方开源模块；
* **webpack**：[webpack](https://webpack.js.org/) 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)，喧喧客户端项目正是依赖 Webpack 来将应用中用到的 JS、CSS、图片等资源打包到一个集中的目录中，方便 Electron 进行调用；
* **React**：[React](https://reactjs.org/) 是一个用于构建用户界面的 JavaScript 库，其组件式开发方式非常适合复杂界面的开发，并且页方便进行二次开发。

## 模块

### 模块概览

## 平台实现

目前官方提供了喧喧客户端在两个平台上的实现：Electron 和 浏览器。其中 Electron 为桌面端版本主要依赖框架，使得喧喧同时支持 Windows、Mac 和 Linux 三大操作系统平台。浏览器端实现了喧喧的基础聊天功能，不包括需要操作系统本地化支持的功能（例如扩展机制），但浏览器端版本实现了在任何能够运行现代浏览器的平台上使用喧喧，包括 Windows、Mac、 Linux、Android 以及 iOS 平台。开发者也可以将喧喧移植到其他类浏览器环境的平台上，例如 [NWJS](https://nwjs.io/) 和 [Chrome 扩展应用](https://chrome.google.com/webstore/category/apps?hl=zh-CN)。

### Electron

Electron 是由 Github 开发，使用用 HTML，CSS 和 JavaScript 来构建跨平台桌面应用程序的一个开源框架。 Electron 通过将 Chromium 和 Node.js 合并到同一个运行时环境中，并将其打包为 Mac，Windows 和 Linux 系统下的应用来实现这一目的。

#### 主进程和渲染进程

Electron 有两个进程，分别为 main 和 renderer，而两者之间是通过 ipc 进行通讯。main 端有 ipcMain，renderer 端有 ipcRenderer，分别用于通讯。

![electron-ipc](electron-ipc.png)

Electron 运行 package.json 的 main 脚本的进程被称为 **主进程**。 在主进程中运行的脚本通过创建 web 页面来展示用户界面。 一个 Electron 应用总是有且只有一个主进程。

由于 Electron 使用了 Chromium 来展示 web 页面，所以 Chromium 的多进程架构也被使用到。 每个 Electron 中的 web 页面运行在它自己的 **渲染进程** 中。

在普通的浏览器中，web页面通常在一个沙盒环境中运行，不被允许去接触原生的资源。 然而 Electron 的用户在 Node.js 的 API 支持下可以在页面中和操作系统进行一些底层交互。

主进程使用 BrowserWindow 实例创建页面。 每个 BrowserWindow 实例都在自己的渲染进程里运行页面。 当一个 BrowserWindow 实例被销毁后，相应的渲染进程也会被终止。

主进程管理所有的web页面和它们对应的渲染进程。 每个渲染进程都是独立的，它只关心它所运行的 web 页面。

### 浏览器

### 移植到其他平台



## 数据库