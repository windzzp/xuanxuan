# 安装 Node.js 和 npm

访问 [Node.js 官网](https://nodejs.org/zh-cn/)下载并安装 Node.js，选择一个适合你的操作系统的安装包，按照官方提示安装即可。虽然不同的 nodejs 版本都可以运行${displayName}，但可能需要额外的配置，建议你下载与${displayName}开发者相同版本的 Node.js 版本。官方开发人员目前使用的 Node.js 环境版本是 **`8.11.3`**，npm 版本为 **`5.6.0`**，你可以在这个页面 https://nodejs.org/zh-cn/download/releases/ 找到对应版本的下载地址。

?> 如果你的系统已经安装有其他版本的 Node.js，并且不想卸载之前的版本，则推荐你使用 [nvm](https://github.com/creationix/nvm)。nvm 允许你安装 Node.js 的多个版本，并且可以自由切换当前使用的版本。

Windows 和 Mac 系统用户可以直接下载非常方便的一键安装包，安装完成后打开命令行窗口输入如下命令查询安装后的版本号，如果输出正确版本号说明安装成功。

```bash
# 查询 Node.js 是否安装，如果安装会显示版本号
$ node -v
v8.11.3

# 查询 npm 是否安装，如果安装会显示版本号
$ npm -v
5.6.0
```

你也可以安装 [`yarn`](https://yarnpkg.com/zh-Hans/) 来代替 `npm`。yarn 提供了更快更稳的包管理体验。要了解如何安装 `yarn` 请访问：

* https://yarnpkg.com

当你安装了 `yarn` 之后，本文档中的所有 `npm` 命令都可以使用 `yarn` 来代替，例如：

```bash
$ npm install
```

替换为 `yarn` 形式：

```bash
$ yarn install
```

yarn 的命令与 npm 命令比较：

<table>
  <thead>
    <tr>
      <th>npm (v5)</th>
      <th>Yarn</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code class="highlighter-rouge">npm install</code></td>
      <td><code class="highlighter-rouge">yarn install</code></td>
    </tr>
    <tr>
      <td><strong><em>(不适用)</em></strong></td>
      <td><code class="highlighter-rouge">yarn install --flat</code></td>
    </tr>
    <tr>
      <td><strong><em>(不适用)</em></strong></td>
      <td><code class="highlighter-rouge">yarn install --har</code></td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">npm install --no-package-lock</code></td>
      <td><code class="highlighter-rouge">yarn install --no-lockfile</code></td>
    </tr>
    <tr>
      <td><strong><em>(不适用)</em></strong></td>
      <td><code class="highlighter-rouge">yarn install --pure-lockfile</code></td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">npm install [package]</code></td>
      <td><code class="highlighter-rouge">yarn add [package]</code></td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">npm install [package] --save-dev</code></td>
      <td><code class="highlighter-rouge">yarn add [package] --dev</code></td>
    </tr>
    <tr>
      <td><strong><em>(不适用)</em></strong></td>
      <td><code class="highlighter-rouge">yarn add [package] --peer</code></td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">npm install [package] --save-optional</code></td>
      <td><code class="highlighter-rouge">yarn add [package] --optional</code></td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">npm install [package] --save-exact</code></td>
      <td><code class="highlighter-rouge">yarn add [package] --exact</code></td>
    </tr>
    <tr>
      <td><strong><em>(不适用)</em></strong></td>
      <td><code class="highlighter-rouge">yarn add [package] --tilde</code></td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">npm install [package] --global</code></td>
      <td><code class="highlighter-rouge">yarn global add [package]</code></td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">npm update --global</code> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</td>
      <td><code class="highlighter-rouge">yarn global upgrade</code> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">npm rebuild</code></td>
      <td><code class="highlighter-rouge">yarn install --force</code></td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">npm uninstall [package]</code></td>
      <td><code class="highlighter-rouge">yarn remove [package]</code></td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">npm cache clean</code></td>
      <td><code class="highlighter-rouge">yarn cache clean [package]</code></td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">rm -rf node_modules &amp;&amp; npm install</code></td>
      <td><code class="highlighter-rouge">yarn upgrade</code></td>
    </tr>
  </tbody>
</table>

要了解 `yarn` 的使用参考 https://yarnpkg.com/zh-Hans/docs/usage