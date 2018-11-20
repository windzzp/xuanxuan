# 浏览器部署

## 体验

${displayName}自版本 1.2 起提供了在浏览器上使用的客户端版本，使用浏览器直接访问下面网址中的一个即可打开浏览器端的最新版本，并可以登录到你的服务器：

* <a href="https://easysoft.github.io/${name}/${version}/" target="_blank"><strong>https://easysoft.github.io/${name}/${version}/</strong> <small>托管在 Github 上的版本</small></a>
* <a href="https://demo.ranzhi.net/" target="_blank"><strong>https://demo.ranzhi.net/</strong> <small>托管在然之服务器上的版本</small></a>

?> 如果你还没有准备好自己的服务器版本，你可以使用官方测试服务器：<br>服务器地址：[`https://demo.ranzhi.net`](https://demo.ranzhi.net)<br>账号：`demo1`、`demo2` ～ `demo10` 中的任意一个<br>密码：`123456`<br>如果你想自己部署${displayName}的服务器请参考 [服务器端部署文档](server/deploy)

?> 你可以放心的在任何一个浏览器版本上登录到你自己的服务器进行使用。${displayName}客户端版本除了使用你的登录信息发送到你所登录的服务器进行验证外，不会将你的登录信息发送到任何其他服务器，在你使用的过程中也不会和其他任何服务器通信。

## 部署

要部署自己的浏览器版本，只需要下载${displayName}浏览器端部署包，上传并解压到你拥有的任何一个支持访问静态文件的 Web 服务器，然后访问 `index.html` 文件即可。${displayName}最新版本浏览器端部署包下载地址：

* [${name}.${version}.browser.zip](${downloadUrl}${version}/${name}.${version}.browser.zip)

如果你只想临时使用，或者体验一下部署过程，下面介绍两种简单方式：

<!-- tabs:start -->

### ** 方式一：http-server **

使用 [http-server](https://github.com/indexzero/http-server) 可以迅速在你自己的电脑启动一个轻量级的 Web 服务来访问${displayName}浏览器版本。

确保你的电脑[安装了 Node.js](guide/install-nodejs.md)，然后安装 `http-server`，在命令行窗口执行：

```bash
$ npm install http-server -g
```

下载并解压${displayName}浏览器端部署包（假设解压后的目录为 `${name}.${version}.browser/`），在命令行窗口中定位到 `${name}.${version}.browser/`，然后执行：

```bash
$ http-server ./
```

如果一切顺利，就可以在浏览器中访问 http://127.0.0.1:8080 来体验浏览器版本功能了。

你还可以指定所访问的端口号，例如将端口号设置为 `80`：

```bash
$ http-server ./ --port=80
```

要了解 http-server 更多功能选项请参考 [https://github.com/indexzero/http-server](https://github.com/indexzero/http-server)。

### ** 方式二：Github Pages **

如果你正在使用 [Github](https://github.com/)，则可以使用 [Github Pages](https://pages.github.com/) 将喧喧部署到云端。，将${displayName}浏览器端版本部署到云端可以让任何人都可以通过公开的网址进行访问。

首先在 [Github](https://github.com/) 上创建一个名称为 `username.github.io` 的版本库，其中 `username` 为你的 Github 用户名。

![user-repo](https://pages.github.com/images/user-repo@2x.png)

克隆版本库到本地，在命令行窗口执行：

```bash
$ git clone https://github.com/username/username.github.io
```

下载并解压${displayName}浏览器端部署包（假设解压后的目录为 `${name}.${version}.browser/`），将目录 `${name}.${version}.browser/` 内的所有文件复制到新创建的版本库目录 `username.github.io/`。

将文件推送到 Github，在命令行执行：

```bash
$ git add --all
$ git commit -m "Initial commit"
$ git push -u origin master
```

然后就可以在 `https://username.github.io` 上访问喧喧浏览器版了。

### ** 方式三：now **

使用 [now](https://zeit.co/now) 可以快捷的在云端部署一个的静态站点，将${displayName}浏览器端版本部署到 `now` 可以让任何人都可以通过公开的网址进行访问。

确保你的电脑[安装了 Node.js](guide/install-nodejs.md)，然后安装 `now-cli`，在命令行窗口执行：

```bash
$ npm installl now -g
```

下载并解压${displayName}浏览器端部署包（假设解压后的目录为 `${name}.${version}.browser/`），在命令行窗口中定位到 `${name}.${version}.browser/`，然后执行：

```bash
$ now
```

?> 如果是第一次使用 `now`，还需要[注册一个免费账户](https://zeit.co/signup)，在第一次执行 `now` 命令时会要求输入注册的邮箱并进行验证。

如果一切顺利，会在命令行窗口显示云端的访问地址。更多关于 `now` 的使用参考 [https://zeit.co/docs/](https://zeit.co/docs/)。

<!-- tabs:end -->

## 限制

### 混合内容（MixedContent）限制

通常浏览器会对<a href="https://developer.mozilla.org/zh-CN/docs/Security/MixedContent" target="_blank">混合内容</a>进行限制访问，${displayName}浏览器端版本也受此限制：

* 如果你使用的${displayName}浏览器版本是使用 https 协议访问的，则你只能连接到仅支持 https 访问的${displayName}服务器，且你的${displayName}服务器必须使用官方安全证书；
* 如果你使用的${displayName}浏览器版本是使用 http 协议访问的，则你只能连接到仅支持 http 访问的${displayName}服务器，此时你与${displayName}服务器到连接是不安全的，加密功能会失效；

默认情况下，${displayName}服务器要求使用 [https 协议](https://zh.wikipedia.org/wiki/%E8%B6%85%E6%96%87%E6%9C%AC%E4%BC%A0%E8%BE%93%E5%AE%89%E5%85%A8%E5%8D%8F%E8%AE%AE)进行安全访问，浏览器端访问也不例外，你需要配置你的 Web 服务器并使用 https 协议来访问${displayName}的浏览器端版本页面。

如果你需要临时使用 http 协议来访问你的服务器，请参考 [XXD 配置 - https](xxd/setting#https)。

### 支持的浏览器

${displayName}浏览器端版本使用了大量最新的 Web 特性，例如 CSS3 的 [Flex](https://developer.mozilla.org/zh-CN/docs/Glossary/Flex) 布局和 Javascript 中的 [`Symbol()` 函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)。在一些老的浏览器上运行${displayName}将会产生兼容性问题甚至无法使用。请尽量在最新的浏览器上使用${displayName}的浏览器端版本。

我们会尽可能确保${displayName}支持目前所有流行浏览器的最新版本，包括移动平台。如果你在这些新的浏览器上使用时遇到问题，欢迎及时反馈到 [${bugs.url}](${bugs.url})。让我们一起将${displayName}做的更好。