# 喧喧

http://xuan.im

由[然之协同](http://ranzhico.com)提供的面向企业即时通信解决方案。

官方 QQ 群：**367833155**
了解项目和计划：http://xuan.5upm.com/product-browse-1.html

![喧喧](https://raw.githubusercontent.com/easysoft/xuanxuan/master/doc/img/preview.png)

## 最近更新

🎉 2.4 本次更新新增消息撤销、聊天输入状态显示以及应用分享等实用功能，修复了已知问题，对接口进行了大幅优化。[查看更新详情→](https://github.com/easysoft/xuanxuan/releases/tag/v2.4.0)

## 特色功能

* **开聊**：和服务器上的任何用户开聊，收发表情、图片、截屏、文件样样在行；
* **开源安全**：源码开放，客户端和服务器通信全程加密，安全可靠；
* **讨论组和公开讨论组**：一个人讨论的不过瘾？随时邀请多人组建个性讨论组，将讨论组公开，任何感兴趣的人都可以加入进来；
* **通知及提醒**：与系统桌面环境集成，即时收到新消息通知；
* **会话管理**：将任意会话（包括讨论组和公开讨论组）置顶，精彩内容不容错过，还可以重命名讨论组、为讨论组设置白名单及浏览会话的所有消息历史记录；
* **通讯录**：浏览企业成员资料和联系信息；
* **跨平台客户端**：目前已支持 Windows、Linux、Mac，并且还提供了浏览器客户端；
* **轻量级服务器端**：轻松搭配[然之协同](http://ranzhico.com)使用。

## 使用

### 桌面客户端

受益于 Electron 的跨平台特性，喧喧客户端提供了 Windows、MacOS 和 Linux 版本。

下载地址见：http://xuan.im/#downloads

更多帮助参见 [官方客户端使用指南](http://xuan.im/page/1.html)。

### 浏览器客户端

浏览器客户端试用请访问：[https://demo.ranzhi.net](https://demo.ranzhi.net/?server=https://demo.ranzhi.net&account=demo1&password=123456&loginTip=%E6%B5%8B%E8%AF%95%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8D%E6%94%AF%E6%8C%81%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%EF%BC%8C%E5%9B%BE%E7%89%87%E5%92%8C%E6%96%87%E4%BB%B6%E7%9B%B8%E5%85%B3%E5%8A%9F%E8%83%BD%E4%BC%9A%E5%8F%97%E9%99%90%E5%88%B6%EF%BC%8C%E4%BD%86%E4%BB%8D%E7%84%B6%E6%94%AF%E6%8C%81%E5%8F%91%E9%80%81%E5%B0%8F%E4%BA%8E%2010kb%20%E7%9A%84%E5%9B%BE%E7%89%87%E3%80%82%E4%BD%A0%E8%BF%98%E5%8F%AF%E4%BB%A5%E4%BD%BF%E7%94%A8%E9%99%A4%20demo%20%E4%B9%8B%E5%A4%96%E7%9A%84%E5%85%B6%E4%BB%96%E8%B4%A6%E5%8F%B7%E7%99%BB%E5%BD%95%EF%BC%8C%E5%8C%85%E6%8B%AC%20demo1%E3%80%81demo2...demo10%E3%80%82#/chats/groups)

注意：你需要为你的服务器端部署通过官方验证的证书才可以使用浏览器端客户端。

更多帮助参见 [浏览器端部署和使用指南](https://github.com/easysoft/xuanxuan/blob/master/doc/browser-usage.md)

### 服务器端

客户端主要通过 `WebSocket` 协议与服务器端进行实时通信，另外还用到了 `https` 协议来从服务器获取配置及上传下载文件。

```
+------------+                 +------------+            +----------------+
|  Xuanxuan  |---------------->|  Xuanxuan  |----------->|   Rangerteam   |
|   Client   | WebSocket/Https |   Server   | Http/Https |     Server     |
|  (PC/Mac)  |<----------------|   (xxd)    |<-----------| (Your Website) |
+------------+                 +------------+            +----------------+
```

客户端与服务器端 API 参考：[API 文档](http://xuan.im/page/3.html)。服务器端 API 同样是开放的，你可以使用自己熟悉的技术（例如 node.js、go、swift）实现自己的服务器端。

官方默认的服务器使用 `go` 语言实现（简称为 `xxd` 服务），你可以在 [`/xxd/`](https://github.com/easysoft/xuanxuan/tree/master/xxd) 目录下找到源代码。xxd 服务提供了 `WebSocket` 和 `https` 接口供客户端使用。

`xxd` 服务本身并不存储和管理用户资料和消息数据，而是使用应用更为广泛的 http 协议与另一个服务器（简称 `http` 服务）通信。这样你只需要在你自己的网站上开发一系列 `http` 接口即可为你的网站用户启用喧喧。

官方默认提供的后段服务是基于开源协同办公软件 [然之协同](https://github.com/easysoft/rangerteam) 开发，你可以在 [`/ranzhi/`](https://github.com/easysoft/xuanxuan/tree/master/ranzhi) 目录下找到相关源代码。然之协同服务器部署请参考：[服务器部署指南](http://xuan.im/page/2.html)。

在 1.4 版本之后，还提供了独立的服务器端 XXB，这样可以不依赖然之协同办公系统，XXB 服务器使用参考 http://xuan.im/page/2.html 。

这里有一个公开的测试服务器供使用：

```
地址：https://demo.ranzhi.net
用户：demo
密码：demo

或用户：demo1, demo2, ... demo10
密码：123456
```

注意：测试服务器不能使用传送文件功能。

### 客户端开发

客户端主要使用的技术为 `Webpack + Electron + React`。使用下面的步骤快速进入开发状态：

1. 下载源码：`git clone https://github.com/easysoft/xuanxuan.git`；
2. 进入源码目录的子目录 `xxc/`，执行：`npm install`；
3. 启动 react hot server，执行：`npm run hot-server`；
4. 启动客户端，执行：`npm run start-hot`。

执行 `npm run package` 进行客户端打包。

详情请参考：[客户端开发者指南](https://github.com/easysoft/xuanxuan/blob/master/doc/client-developer.md)

### 扩展开发

参见：https://github.com/easysoft/xuanxuan/blob/master/doc/extension.md

## 许可证

喧喧使用 [ZPL](https://github.com/easysoft/xuanxuan/blob/master/LICENSE) 开源许可证，另外还使用了如下开源项目：

* [Electron](http://electron.atom.io/)、[React](https://facebook.github.io/react/)、[Webpack](https://webpack.github.io)：跨平台客户端开发支持；
* [electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate)：提供项目模板；
* [EmojiOne](http://emojione.com/)：提供 Emoji 表情及图片资源支持；
* 其他重要开源项目包括：[draft.js](https://facebook.github.io/draft-js/)、[Babel](https://babeljs.io/)、ß[marked](https://github.com/chjj/marked)、[ion.sound](https://github.com/IonDen/ion.sound) 等。


