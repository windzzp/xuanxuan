# 打包

本文将介绍如何将${displayName}源代码编译并打包为适合各个桌面平台的安装包以及生成浏览器端安装包。

阅读本文需要你具备如下技能：

* 能够简单使用命令行执行程序，如果遇到问题可以通过 [CodeCademy 上的免费课程](https://www.codecademy.com/learn/learn-the-command-line) 进行学习。

## 基本使用

客户端端打包命令需要在客户端源码目录进行，首先进入客户端源码目录 [`${repository.clientSourceRoot}`](${repository.sourceUrl}${repository.clientSourceRoot})：

```bash
$ cd ${name}/xxc
```

如果是第一次进行打包操作，请确保已初始化${displayName}客户端开发环境，如果没有请先执行如下命令（详情参考[客户端开发环境搭建](client/start.md)文档）：

```bash
$ npm install
```

然后使用 [npm](https://docs.npmjs.com/) 执行如下命令：

```bash
$ npm run package
```

此命令对应的脚本文件为 [`${repository.clientSourceRoot}build/package.js`](${repository.sourceUrl}${repository.clientSourceRoot}build/package.js)，也可以直接调用 Node 程序来执行此文件实现：

```bash
$ node --max_old_space_size=2096 -r babel-register ./build/package.js
```

${displayName}支持为 Windows、Mac 或 Linux 三个桌面平台的平台打包安装程序。执行上述命令会自动打包一个适合当前桌面操作系统运行的版本，即在 Windows 64 位操作系统上会生产一个适合 Windows 64 位操作系统使用的安装包，在 Mac 上会生成一个 Mac 上使用的 dmg 文件（Mac 不支持打包 32 位安装包），在 Linux 上将生成适合 Linux 使用的安装包。

?> 最终生成的安装包将会存放在 `${repository.clientSourceRoot}release/${version}/` 文件夹下。

## 打包浏览器端部署包

${displayName}也提供了适合在浏览器上运行的版本，要打包浏览器端部署包只需要执行如下命令：

```bash
$ npm run package-browser
```

或者：

```bash
$ npm run package --platform=browser
```

?> 最终生成的浏览器部署包存储在在 `${repository.clientSourceRoot}release/${version}/${name}.${version}.browser.zip`。

## 打包用于调试的版本

在正式发布的版本中，通常会移除用于输出调试日志信息的功能，有时仍然希望能给开发者提供像开发模式一样能够正常输出调试日志的正式版本，只需要执行如下命令：

```bash
$ npm run package-debug
```

或：

```bash
$ npm run package -- --debug
```

?> 所有最终生成的调试版本安装包名称包含 `debug` 字段，例如：`${name}.${version}.win.debug.setup.exe`。

## 打包用于内测的版本

有时在正式版本发布之前想打包一个 Beta 版本供用户测试，只需要执行如下命令：

```bash
$ npm run package-beta
```

或：

```bash
$ npm run package -- --beta
```

这样生成的${displayName}应用版本信息为 `v${version}.beta.{datetime}`（其中 `{datetime}` 为打包时间戳）。

?> 所有最终生成的调试版本安装包存放在 `${repository.clientSourceRoot}release/${version}-beta/`，安装包名称都包含 `beta` 字段，例如：`${name}.${version}.beta.mac.dmg`。

你还可以自定义 Beta 版本信息在界面上显示的格式，例如：

```bash
$ npm run package -- -b 'alpha.yyyy-MM-dd hh:mm'
```

这样生成的${displayName}应用版本信息类似为 `v${version}.alpha.2018-11-01 10:41`。

你可以能注意到了 `-b` 参数中的 `yyyy-MM-dd hh:mm` 被自动替换为当前时间格式化后的字符串，所有可用的格式化参数包括：

| 格式化参数 | 输出示例 | 说明                                        |
| ---------- | -------- | ------------------------------------------- |
| `yyyy`     | `'2018'` | 四位数字表示的年份                          |
| `yy`       | `'18'`   | 两位数字表示的年份                          |
| `MM`       | `'07'`   | 两位数字表示的月份，不足两位在起始用 0 填充 |
| `M`        | `'10'`   | 一位或两位数字表示的月份                    |
| `dd`       | `'05'`   | 两位数字表示的日期，不足两位在起始用 0 填充 |
| `d`        | `'5'`    | 一位或两位数字表示的日期                    |
| `hh`       | `'08'`   | 两位数字表示的小时，不足两位在起始用 0 填充 |
| `h`        | `'8'`    | 一位或两位数字表示的小时                    |
| `mm`       | `'3'`    | 两位数字表示的分钟，不足两位在起始用 0 填充 |
| `m`        | `'03'`   | 一位或两位数字表示的分钟                    |
| `ss`       | `'5'`    | 两位数字表示的秒数，不足两位在起始用 0 填充 |
| `s`        | `'05'`   | 一位或两位数字表示的秒数                    |
| `S`        | `'236'`  | 毫秒数                                      |

## 跨平台打包

默认情况下，你只能为当前所使用的操作系统平台打包桌面端，但得益于 [electron-builder](https://www.electron.build/) 使得跨平台打包成为可能。下面以 Mac 为例，介绍如何准备系统环境使得在 Mac 上也能够生成适合 Windows 和 Linux 系统的安装包。要在其他平台上进行跨平台打包请参考 [electron-builder 官方文档](https://www.electron.build/multi-platform-build)。

确保你的系统安装了 [brew](http://brew.sh/) 来安装跨平台打包的依赖工具，如果没有安装，执行如下命令进行安装：

```bash
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

执行如下命令为打包 Windows 版本做准备：

```bash
$ brew install wine --without-x11
$ brew install mono
```

执行如下命令为打包 Linux 版本做准备：

```bash
$ brew install gnu-tar graphicsmagick xz
```

如果你还需要构建 Linux rpm 包，则需要安装 rpm：

```bash
$ brew install rpm
```

完成上述步骤之后就可以使用如下命令来构建所需的平台版本了：

| 命令                        | 原始命令                                               | 作用                           |
| --------------------------- | ------------------------------------------------------ | ------------------------------ |
| `npm run package-win`       | `npm run package -- --platform=win --arch=x64`         | 打包 Windows 64 位安装包       |
| `npm run package-win-32`    | `npm run package -- --platform=win --arch=x32`         | 打包 Windows 32 位安装包       |
| `npm run package-win-debug` | `npm run package -- --platform=win --arch=x64 --debug` | 打包 Windows 64 位调试版安装包 |
| `npm run package-mac`       | `npm run package -- --platform=mac --arch=x64`         | 打包 Mac 64 位安装包           |
| `npm run package-mac-debug` | `npm run package -- --platform=mac --arch=x64 --debug` | 打包 Mac 64 位调试版安装包     |
| `npm run package-linux`     | `npm run package -- --platform=linux --arch=x64`       | 打包 Linux 64 位安装包         |
| `npm run package-linux-32`  | `npm run package -- --platform=linux --arch=x32`       | 打包 Linux 32 位安装包         |

如果已经确认能够在当前操作系统上进行跨平台打包并支持所有平台，则可以直接使用如下命令一次性打包所有目标平台上的安装包：

```bash
$ npm run package-all
```

相当于：

```bash
$ npm run package -- --platform=all --arch=all --clean && npm run package -- --platform=mac,win --arch=x64 --debug
```

这样能够一次性生成${displayName}所支持的全部平台上的安装包，甚至包括浏览器端部署包，以及适合 Windows 和 Mac 上的调试版安装包。

如果要一次性打包所有目标平台上的内测版本安装包则可以：

```bash
$ npm run package-all-beta
```

相当于：

```bash
$ npm run package -- --platform=all --arch=x64 --beta --clean && npm run package -- --platform=mac,win --arch=x64 --debug --beta
```

## 高级打包配置

有时我们需要打包定制版本，${displayName}的打包机制允许我们通过一个配置文件来定制最终打包的${displayName}应用程序。可供定制的内容非常丰富，包括应用名称、LOGO 图像、版本信息、界面配色以及界面上显示的语言文字，甚至可以配置最终程序是否启用某些特色功能。此定制机制没有修改官方源码，并且可以与官方后续版本保持同步更新。

!> ${displayName}使用 [${license} 开源许可协议](${repository.sourceUrl}LICENSE)，更改应用名称以及登录界面和关于界面上的 LOGO 图像需要取得我们的授权，详情请阅读   [官方网站定制开发页面](${contact})。如果仅仅是更改界面配色以及显示的语言文本，或者关闭某些功能则不需要获取我们的授权。

### 高级打包配置步骤

下面已打包一个简单的自定义版本为例：

1. 首先为配置起一个英文名称，例如 `custom`；

2. 进入 `${repository.clientSourceRoot}build/` 目录，创建子目录 `build.custom`，即确保目录 `${repository.clientSourceRoot}build/build.custom/` 目录存在；

3. 在 `build.custom` 目录创建 JSON 文件 `build-config.json`，在文件中写入如下内容并保存：

   ```json
   {
       "name": "${name}-custom",
       "productName": "${displayName}定制版",
       "version": "10.0.0"
       "configurations": {
           "specialVersion": "定制版",
           "lang": {
               "zh-cn": {
                   "common.littlexx": "我的通知"
               }
           }
       }
   }
   ```

4. 然后执行如下命令进行打包：

   ```bash
   $ npm run package -- --config=custom
   ```

5. 耐心等待命令执行完毕后，就可以在 `${repository.clientSourceRoot}release/custom-10.0.0/` 目录下找到此定制版本的安装包。

使用以上步骤打包的安装包进行安装，打包应用程序之后，发现应用程序名称为 "${displayName}定制版"，版本号为 "10.0.0"，并且通知中心会话名称为 “我的通知”（原为“${displayName}”）。

### 打包配置文件

上述步骤 3 中新建的文件 `build.custom/build-config.json` 为打包配置文件，采用 [JSON 文件格式](https://www.json.org/json-zh.html)，除了定义应用名称以及版本号还可以定义界面外观和启用或禁用某些功能。下面将提供一个完整的配置文件，用来说明所有可使用的配置项（实际使用时只需要在配置文件提供相关配置项即可）：

```json
{
    // 应用程序内部名称，默认为 "${name}"
    "name": "${name}-custom",

    // 应用程序显示名称，默认为 "${displayName}"
    //   注意：修改应用名称请确保遵从${displayName}的许可协议：
    //   ${repository.sourceUrl}LICENSE，
    //   修改为除 “${displayName}” 之外的任何名称都需要取得我们的授权，
    //   如果你不确定，请联系官方人员解决 ${contact}
    "productName": "${displayName}定制版",

    // 应用描述，通常显示在关于对话框中，默认与 ${repository.clientSourceRoot}app/package.json 中一致
    "description": "${description}",

    // 应用网站首页地址，通常显示在关于对话框中，默认与 ${repository.clientSourceRoot}app/package.json 中一致
    "homepage": "${homepage}",

    // 应用版本，通常显示在登录界面和关于对话框中，默认与 ${repository.clientSourceRoot}app/package.json 中一致
    "version": "${version}",

    // 授权版本，通常显示在关于对话框中，默认为 "${license}"
    //   注意：修改授权协议需要取得我们的 OEM 授权
    //   如果你不确定，请联系官方人员解决 ${contact}
    "license": "${license}",

    // 开发公司，通常显示在关于对话框中，默认与 ${repository.clientSourceRoot}app/package.json 中一致
    "company": "${company}",

    // 开发作者或者开发团队信息，默认与 ${repository.clientSourceRoot}app/package.json 中一致
    "author": {
        // 名称
        "name": "${author.name}",
        // 联系邮箱
        "email": "${author.email}"
    },

    // Bugs 反馈页面，默认与 ${repository.clientSourceRoot}app/package.json 中一致
    "bugs": {
        "url": "${bugs.url}"
    },

    // 版本库信息（适用于开源版本），默认与 ${repository.clientSourceRoot}app/package.json 中一致
    "repository": {
        // 版本库类型
        "type": "git",
        // 版本库地址
        "url": "${repository.url}"
    },

    // 资源目录路径，默认为 “”（即使用${displayName}默认资源目录 ${repository.clientSourceRoot}resources）
    //   此路径相对于当前配置文件所在的目录
    //   注意：修改 LOGO 图像、应用图标等媒体资源需要取得官方授权协议
    //   如果你不确定，请联系官方人员解决 ${contact}
    "resourcePath": "./resouces/",

    // 媒体目录路径，默认为 “”（即使用${displayName}默认媒体目录 ${repository.clientSourceRoot}app/media）
    //   此路径相对于当前配置文件所在的目录
    //   注意：修改 LOGO 图像、应用图标等媒体资源需要取得官方授权协议
    //   如果你不确定，请联系官方人员解决 ${contact}
    "mediaPath": "",

    // 如果设置了自定义媒体目录路径 "mediaPath"，是否提前复制原始媒体目录（${repository.clientSourceRoot}app/media）
    //   当此选项为 true 时，仅仅需要中在自定义媒体目录中提供需要替换的部分媒体文件即可，
    //   其他媒体依然使用原始媒体目录下的文件
    "copyOriginMedia": true,

    // 指定一个 LESS 或 CSS 文件来为界面添加样式，默认为 “”
    //   此文件路径相对于当前配置文件所在的目录
    "stylePath": "./custom-style.less",

    // 用于重新设置 ${repository.clientSourceRoot}app/config 目录下的配置
    "configurations": {
        "ui": {
          	"chat.urlInspector": false,
        },
        "lang": {
            "zh-cn": {
                "app.title": "${displayName}定制版",
                "common.littlexx": "我的通知"
            }
        }
    }
}
```

!> 在目前普遍使用的 JSON 语言版本中不允许使用 `// comment` 来添加注释，实际使用时，应该将以上示例内容中的注释内容去掉。

### 替换打包资源

通过 `resourcePath` 配置项可以使用自定义的图标资源来进行打包，下面还是以 [高级打包配置步骤](#高级打包配置步骤)为例：

1. 在 `${repository.clientSourceRoot}build/build.custom/` 目录下创建子目录 `resouces`；

2. 修改 `${repository.clientSourceRoot}build/build.custom/build-config.json` 文件，添加如下内容：
   ```json
   {
       // ...

       "resourcePath": "./resouces/",

       // ...
   }
   ```

3. 拷贝 `${repository.clientSourceRoot}resources` 目录内的所有文件和目录到 `${repository.clientSourceRoot}build/build.custom/resources` 目录内；

4. 替换 `${repository.clientSourceRoot}build/build.custom/resources` 内需要替换的图标或 LOGO 图片文件；

5. 重新执行打包 `npm run package -- -c custom`。

?> `resourcePath` 路径为相对于当前配置文件所在的目录。

!> 注意：修改 LOGO 图像、应用图标等媒体资源需要取得官方授权协议，如果你不确定，请联系官方人员解决 ${contact}。

### 替换应用所使用的媒体文件

通过 `mediaPath` 配置项可以使用自定义的图片或消息提示播放声音以及自定义的 Emoji 表情图片资源，下面还是以 [高级打包配置步骤](#高级打包配置步骤)为例来自定义${displayName}消息提醒播放声音：

1. 准备消息提示音频文件，需要提供 `.aac`、`.mp3`、`.ogg`三种文件格式，分别命名为 ` message.aac`、`message.mp3`、`message.ogg`

2. 在 `${repository.clientSourceRoot}build/build.custom/` 目录下创建子目录 `media/sound`，将文件 `message.aac`、`message.mp3`、`message.ogg`复制到 `${repository.clientSourceRoot}build/build.custom/medi/sound/`目录内 ；

3. 修改 `${repository.clientSourceRoot}build/build.custom/build-config.json` 文件，添加如下内容：

   ```json
   {
       // ...

       "mediaPath": "./media/",
       "copyOriginMedia": true,

       // ...
   }
   ```

4. 重新执行打包 `npm run package -- -c custom`。

?> `mediaPath` 路径为相对于当前配置文件所在的目录。

?>  以上步骤 3 中，如果 `copyOriginMedia` 配置项设置为 `false`，则需要在 `${repository.clientSourceRoot}build/build.custom/media` 目录内提供 `${repository.clientSourceRoot}app/media` 目录内提供的所有同名文件。

!> 注意：修改 LOGO 图像、应用图标等媒体资源需要取得官方授权协议，如果你不确定，请联系官方人员解决 ${contact}。

### 使用样式表文件自定义界面外观

通过 `stylePath` 配置项可以使用 LESS 文件或者 CSS 文件来为界面添加额外的样式定义。下面还是以 [高级打包配置步骤](#高级打包配置步骤)为例来将${displayName}界面主要配色设置为喜气的 <span style="background: #E53935; color: #fff"> 红色 </span>：

1. 准备消息提示音频文件，需要提供 `.aac`、`.mp3`、`.ogg`三种文件格式，分别命名为 ` message.aac`、`message.mp3`、`message.ogg`

2. 在 `${repository.clientSourceRoot}build/build.custom/` 目录下创建 LESS 文件 `style.less`，在此文件中添加如下内容：

   ```less
    @color-primary:   #F44336;
    @color-secondary: #E53935;
   ```

3. 修改 `${repository.clientSourceRoot}build/build.custom/build-config.json` 文件，添加如下内容：

   ```json
   {
       // ...

       "stylePath": "./style.less",

       // ...
   }
   ```

4. 重新执行打包 `npm run package -- -c custom`。

> Less 是一门CSS 预处理语言，它扩展了CSS 语言，增加了变量、Mixin、函数等特性。---- [LESS 中文网](http://lesscss.cn/)

?> 在以上步骤 3 中，使用到了 LESS 变量来定义界面上用到的主要配色，由于 [LESS 变量懒加载特性](http://lesscss.cn/features/#variables-feature-lazy-loading)，我们只需要重新设置 [MZUI](${repository.sourceUrl}${repository.clientSourceRoot}app/style/mzui/) 中的颜色变量即可，所有可能重新设置的变量可以在 [`${repository.clientSourceRoot}app/style/mzui/variables.less`](${repository.sourceUrl}${repository.clientSourceRoot}app/style/mzui/variables.less) 文件中找到。此步骤中也可以使用传统的 CSS 文件来定义样式，但要达到同样目的显然没有使用 LESS 文件方便。

?> `stylePath` 路径为相对于当前配置文件所在的文件。

### 替换界面上特定语言文本

通过 `configurations` 配置对象中的 `lang` 属性，可以对界面上特定语言的文本进行部分或全部替换。下面还是以 [高级打包配置步骤](#高级打包配置步骤)为例来将${displayName}登录界面上的表单输入框提示文本进行个性化替换：

1. 修改 `${repository.clientSourceRoot}build/build.custom/build-config.json` 文件，添加如下内容：

   ```json
    {
       // ...

        "configurations": {
            "lang": {
               "zh-cn": {
                    "login.serverUrl.hint": "demo.ranzhi.net",
                    "login.btn.label": "马上登录",
               }
            }
        }

       // ...
    }
   ```

2. 重新执行打包 `npm run package -- -c custom`。

使用以上步骤打包的安装包进行安装，打包应用程序之后，发现应用程序登录界面中的登录按钮原文字内容为 “登录”，现在为 “马上登录”，同时服务器输入框为输入内容时的提示文本为 "demo.ranzhi.net"。

?> 步骤 1 中所有可供替换的语言配置参考：[${repository.clientSourceRoot}app/lang/zh-cn.json](${repository.sourceUrl}${repository.clientSourceRoot}app/lang/zh-cn.json)。

### 禁用或启用特色功能

通过 `configurations` 配置对象中的 `ui` 属性，可以对应用程序中的特色功能进行启用或者禁用。目前所有可用的界面功能选项以及默认值包括（参考 [`${repository.clientSourceRoot}app/config/ui.json`](${repository.sourceUrl}${repository.clientSourceRoot}app/config/ui.json)）：

```json
{
    // ...

    "configurations": {
        "ui": {

            // 聊天界面中向上滚动消息时，每次自动加载的历史消息数目
            "chat.flow.size": 20,

            // 是否允许 Markdown 中使用部分受限的 HTML 标签，例如 <strong> <em> 等
            "chat.markdown.html": true,

            // 发送消息快捷键可用组合
            "hotkey.sendMessageOptions": ["Enter", "Alt+Enter", "Ctrl+Enter", "Shift+Enter", "Ctrl+Shift+Enter", "Ctrl+Alt+Enter"],

            // 推荐发送剪切板图片时提示面板停留的时间，单位毫秒
            "chat.suggestPanelShowTime": 10000,

            // 是否启用网址转卡片功能
            "chat.urlInspector": true,

            // 列表上默认显示的条目数目
            "page.start.size": 20,

            // 列表上点击显示更多加载的条目数目
            "page.more.size": 20
        }
    }

    // ...
}
```

## 所有可用的命令行参数

因为 `npm run <script>` [无法直接传递自定义参数](https://docs.npmjs.com/cli/run-script#description)，需要先使用 `--` 符号，然后再添加参数，以下命令参数均使用如下格式实现：

```bash
$ npm run package -- [options]
```

### `-p, --platform <platform>`

设置要打包的目标平台。例如指定打包适合 Windows 平台的安装包：

```bash
$ npm run package -- -p win
```

所有可用的目标平台包括：`win`（Windows）、`mac`（Mac OS）、`linux`（Linux），`browser`（浏览器端）。默认值为特殊值 `current`，表示当前操作系统对应的平台。要进行跨平台打包[参考“跨平台打包”章节](#跨平台打包)。

也可以将多个目标平台值使用英文逗号 "," 进行拼接，实现一次性打包多个平台安装包，例如：

```bash
$ npm run package -- -p win,mac
```

如果要一次性为所有平台打包（包括 Windows、Mac、Linux 和浏览器端），则可用使用特殊值 `all` 或者 `*`：

```bash
$ npm run package -- -p all
```

### `-a, --arch <arch>`

设置需要打包的平台架构类型，例如制定打包 Windows 64 位操作系统上的安装包：

```bash
$ npm run package -- -p win -a x64
```

所有可用的架构类型包括 `x32`（32 位） 和 `x64`（64 位）。默认值为特殊值 `current`，表示当前操作系统对应的架构类型。要进行跨平台打包[参考“跨平台打包”章节](#跨平台打包)。

也可以将多个架构类型值使用英文逗号 "," 进行拼接，实现一次性打包多个架构类型安装包，例如：

```bash
$ npm run package -- -p win -a x64,x32
```

如果要一次性为所有架构类型打包（包括 64 位和 32 位），则可用使用特殊值 `all` 或者 `*`：

```bash
$ npm run package -- -p win -a all
```

!> 当目标平台为 Mac，架构类型设置为 `x32` 将不会生效，因为目前不支持为 Mac 打包 32 位安装包。

### `-d, --debug`

启用该参数将会生成用于调试的安装包，[参考“打包用于调试的版本”章节](#打包用于调试的版本)。

```bash
$ npm run package -- --debug
```

或：

```bash
$ npm run package -- -d
```

### `-b, --beta [beta]`

启用该参数将会生成标记为内部测试版本的安装包，[参考“打包用于内测的版本”章节](#打包用于内测的版本)。

```bash
$ npm run package -- --beta
```

或：

```bash
$ npm run package -- -b
```

### `-C, --clean`

启用该参数将在生成安装包之前清空安装包存储目录，之前所有旧的文件都将被删除，非常适合一次性生成多个平台的安装包。

```bash
$ npm run package -- --clean
```

或：

```bash
$ npm run package -- -C
```

### `-v, --verbose`

启用该参数将会输出脚本执行过程中额外的用于调试的信息，包括 `electron-builder` 构建过程信息。

```bash
$ npm run package -- --verbose
```

或：

```bash
$ npm run package -- -v
```

### `-s, --skipbuild`

启用该参数将会略过生成最终安装包，仅仅生成 `electron-builder` 所需的 `${repository.clientSourceRoot}build/electron-builder.json` 配置文件以及源码目录下的 `${repository.clientSourceRoot}app/package.json` 文件。此命令参数通常用于首次配置开发环境使用。

```bash
$ npm run package -- --skipbuild
```

或：

```bash
$ npm run package -- -s
```

### `-c, --config <config>`

使用高级打包配置，用于制作自定义版本安装包。需要提供配置名称或者配置文件完整路径作为参数值，具体使用[参考“高级打包配置”章节](#高级打包配置)。

```bash
$ npm run package -- --config=custom
```

或：

```bash
$ npm run package -- -c custom
```

### `-V, --version`

获取命令行工具版本信息。执行：

```bash
$ npm run package -- --version
```

或：

```bash
$ npm run package -- -V
```

### `-h, --help`

获取命令行工具帮助信息。执行：

```bash
$ npm run package -- --help
```

或：

```bash
$ npm run package -- -h
```

得到如下输出：

```
Usage: package|npm run package -- [options]

${displayName}的打包工具

Options:
  -V, --version              output the version number
  -c, --config <config>      打包配置名称或者指定打包配置文件所在路径 (default: "")
  -s, --skipbuild            是否忽略构建最终安装包，仅仅生成用于构建所需的配置文件
  -p, --platform <platform>  需要打包的平台，可选值包括: "mac", "win", "linux", "browser", "current", 或者使用英文逗号拼接多个平台名称，例如 "win,mac", 特殊值 "current" 用于指定当前打包工具所运行的平台, 特殊值 "all" 或 "*" 用于指定所有平台（相当于 “mac,win,linux,browser”） (default: "current")
  -a, --arch <arch>          需要打包的平台处理器架构类型, 可选值包括: "x32", "x64", 或者使用英文逗号拼接多个架构名称，例如 "x32,x64", 特殊值 "current" 用于快捷指定当前打包工具所运行的平台架构类型, 特殊值 "all" 或 "*" 用于指定所有架构类型（相当于 “x32,x64”） (default: "current")
  -d, --debug                是否打包为方便调试的版本
  -b, --beta [beta]          是否将版本标记为 Beta 版本 (default: false)
  -v, --verbose              是否输出额外的信息
  -C, --clean                存储安装包之前是否清空旧的安装包文件
  -h, --help                 output usage information
```

## 参考

* [Electron 应用程序打包](https://electronjs.org/docs/tutorial/application-packaging)
* [electron-builder](https://www.electron.build/)