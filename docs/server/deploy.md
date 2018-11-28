# 服务器端部署

喧喧服务器端包含后端服务和 XXD 服务，要针对两种类型的服务分别进行部署，他们可以部署在同一台物理服务器上。

## 部署后端服务

后端服务主要作用为喧喧提供数据存储管理、用户组织管理以及相关功能配置，并为 XXD 服务器提供了一套 HTTP 协议接口。后端服务最终会提供一个 Web 界面供用户使用。官方提供了 xxb 和[然之协同](http://www.ranzhi.org/)两种类型的后端服务。当使用然之协同作为后端服务时还可以使用然之协同办公系统提供的大量实用功能，要了解更多请访问然之协同官方网站 [http://www.ranzhi.org/](http://www.ranzhi.org/)。下面分别介绍如何部署这两种后端服务。

<!-- tabs:start -->

### ** 部署 xxb **

#### 1. 下载并安装

##### 使用源码包

xxb 作为喧喧独立后端服务，采用 [php](http://www.php.net/) + [mysql](https://www.mysql.com/cn/) 开发实现，并采用了 [ZentaoPHP](http://devel.cnezsoft.com/page/zentaophp.html) 作为开发框架。如果你已经熟悉在服务器上来部署使用 php + mysql 技术实现的 Web 站点则只需要下载源码包进行部署即可，下载地址为：

<a href="${downloadUrl}${version}/xxb.${version}.zip" target="_blank" class="link-item">xxb.${version}.zip</a>

##### 使用一键安装包

xxb 还提供了一键安装包，支持在 Windows 和 Linux 上开箱即用，非常适合不想折腾或者不熟悉 Web 服务器相关技术的人员使用。根据你所使用的操作系统选择合适的一键安装包下载地址进行下载：

| 操作系统类型 | 64 位系统  | 32 位系统 |
| ---------- | --------- | -------- |
| Windows    | [xxb.${version}.win64.exe](${downloadUrl}${version}/xxb.${version}.win64.exe) | [xxb.${version}.win32.exe](${downloadUrl}${version}/xxb.${version}.win32.exe) |
| Linux      | [xxb.${version}.zbox_64.tar.gz](${downloadUrl}${version}/xxb.${version}.zbox_64.tar.gz) | [xxb.${version}.zbox_32.tar.gz](${downloadUrl}${version}/xxb.${version}.zbox_32.tar.gz) |
| Linux(rpm) | [xxb-${version}-1.noarch.rpm](${downloadUrl}${version}/xxb-${version}-1.noarch.rpm) | - |
| Linux(deb) | [xxb_${version}_1_all.deb](${downloadUrl}${version}/xxb_${version}_1_all.deb) | - |

安装完成后即可启动服务器。

#### 2. 设置服务器

在浏览器中打开服务器管理站点页面，以管理员的身份登录，进入设置功能页面，设置一个 32 位字符的密匙（例如 `btybgdhwh6spvn2278gl4udd5dwir6lc`，该密匙字符串在 XXD 服务配置中还会用到），为保证安全性，尽量使用随机字符串作为密匙，并且妥善保管此密匙，确保不要泄露给无关人员。在服务器管理页面站点页面还可以为系统添加更多的用户账号。

#### 3. 调试

如果需要对 xxb 服务进行调试操作则需要在站点目录中的 `xxb/config/my.php` 文件中将 `debug` 字段设置为 `true`，这样就可以在 `xxb/tmp/log/xuanxuan.log.php` 文件中功能查看后端服务日志了。

### ** 部署然之协调服务 **

#### 1. 下载和安装

首先下载然之协同最新版本：

<a href="http://www.ranzhi.org/download.html" target="_blank" class="link-item">然之协同版本下载页面</a>

下载安装包之后按照官方页面描述进行安装。通常最新版本然之协同会内置发布时喧喧的最新版本后端，但有时也可能会落后喧喧版本。在安装完成后以管理员身份登录然之协同站点（如果是采用一键安装包安装，默认账号为 `admin`，密码为 `123456`），进入 **后台 → 系统 → 喧喧** 功能页面，查看内置的喧喧版本是否为最新版本（**`${version}`**）。如果不是最新版本则需要手动进行升级，方法是：

1. 下载喧喧然之协同扩展包：[${name}.ranzhi.${version}.zip](http://dl.cnezsoft.com/${name}/${version}/${name}.ranzhi.${version}.zip)，解压扩展包并覆盖到然之站点根目录；
2. 通过浏览器访问然之协同站点目录下的 `www/upgradexuanxuan.php` 文件进行升级（例如然之演示站的访问地址是 [http://demo.ranzhi.net](http://demo.ranzhi.net)，则访问 http://demo.ranzhi.net/upgradexuanxuan.php 升级），如果已经是最新版，访问该页面会自动跳转到首页。

#### 2. 设置服务器

以管理员的身份登录然之协同，进入  **后台 → 系统 → 喧喧** 功能页面，设置一个 32 位字符的密匙（例如 `btybgdhwh6spvn2278gl4udd5dwir6lc`，该密匙字符串在 XXD 服务配置中还会用到），为保证安全性，尽量使用随机字符串作为密匙，并且妥善保管此密匙，确保不要泄露给无关人员。在 **后台 → 组织** 功能页面还可以为系统添加更多的用户账号。

#### 3. 调试

如果需要对然之协同服务进行调试操作则需要在站点目录中的 `ranzhi/config/my.php` 文件中将 `debug` 字段设置为 `true`，这样就可以在 `ranzhi/tmp/log/xuanxuan.log.php` 文件中功能查看后端服务日志了。

<!-- tabs:end -->

### 定制后端服务

除了官方提供的 xxb 和燃脂协同作为后端服务，还可以根据需要定制自己的后弹服务。后端服务协议接口为 HTTP，你可用使用 PHP、Node.js、Go 等任何技术来实现，甚至可以直接在已有的系统进行开发，只需要提供后端服务所要求的接口即可。详细接口说明参考“[后端服务接口](server/api)”文档。

## 部署 XXD 服务

XXD 作为喧喧的中间守护服务器，采用 Go 语言实现，为 Windows、Mac 和 Linux 系统都提供了直接运行的程序。要部署 XXD 服务参考如下步骤：

### 1. 下载和安装

下载对应系统上的 XXD 服务程序包，下载地址为：

| 操作系统类型 | 64 位系统  | 32 位系统 |
| ---------- | --------- | -------- |
| Windows    | [xxd.${version}.win64.zip](${downloadUrl}${version}/xxd.${version}.win64.zip) | [xxd.${version}.win32.zip](${downloadUrl}${version}/xxd.${version}.win32.zip) |
| Linux      | [xxd.${version}.linux.x64.tar.gz](${downloadUrl}${version}/xxd.${version}.linux.x64.tar.gz) | [	xxd.${version}.linux.ia32.tar.gz](${downloadUrl}${version}/	xxd.${version}.linux.ia32.tar.gz) |
| Mac OS     | [xxd.${version}.mac.tar.gz](${downloadUrl}${version}/xxd.${version}.mac.tar.gz) | - |

### 2. 设置

将程序包解压缩到本地磁盘目录中，假设目录为 `xxd/`，找到 `xxd/config/xxd.conf` 配置文件，使用熟悉的文本编辑器（最好是源代码编辑器）进行编辑。该配置文件使用 [ini 文件格式](https://zh.wikipedia.org/zh/INI%E6%96%87%E4%BB%B6) 进行存储。根据自己的网络情况在配置文件中对服务器进行设置，所有可用的设置及说明如下：

```ini
[server]
# 监听的服务器ip地址。
# ip地址应该填写服务器的内网ip，生产环境请勿使用127.0.0.1。如果使用127.0.0.1，客户端只能通过127.0.0.1登录。
ip=0.0.0.0

# 与聊天客户端通讯的端口。
chatPort=11444

# 通用端口，该端口用于客户端登录时验证，以及文件上传下载使用。
commonPort=11443

# 是否启用https，设置为0使用http协议，设置为1使用https协议。客户端登陆时http协议要和此处设置保持一致。
# 如果启用https，xxd默认使用自己生成的证书。如果要通过浏览器访问，则需要使用官方认证的证书替换证书保存路径(证书保存路径在配置文件最后配置)下的证书。替换的证书要和原来的证书名保持一致。
# 如果将此项设置为 0，则加密会失效，强烈建议在生产环境设置为 1。
isHttps=1

# 上传文件的保存路径，最后的“/”不能省略，表示路径。
# 注意：Windows下路径中的‘\’需要转义写成‘\\’，例如‘D:\xxd\files’要写成‘D:\\xxd\\files’。
uploadPath=tmpfile/

# 上传文件的大小，支持：K,M,G。
uploadFileSize=32M

# 在线用户上限限制，0为不限制
maxOnlineUser=0

[ranzhi]
# xxd是一台消息转发服务器，可以连接到多个后端服务器。后端服务器配置信息格式如下([]表示此内容为选填项)：
#
# 服务器名称=传输协议://请求地址[:端口][/目录名称]/入口文件,密钥[,是否默认服务器]
#
# 服务器名称：必填。只能使用英文字母。可以配置多个后端服务器，客户端登录时根据服务器名称区分连接到哪个后端服务器。
# 传输协议：必填。http 或者 https。此处的传输协议是xxd通过http请求连接到后端服务器时使用，使用哪种传输协议取决于后端服务器的配置，与上文中的isHttps配置无关。
# 请求地址：必填。后端服务器的请求地址，可以是域名或者ip。根据后端服务器的配置不同，可能需要添加目录名称。
# 端口：选填。默认使用80端口时可以不填写，否则需要填写端口。
# 目录名称：选填。如果后端服务器配置的域名或者ip没有指向入口文件所在的目录，则必须添加目录名称。
# 入口文件：必填。入口文件指xxd连接的后端服务器处理xxd请求的入口文件，固定为xuanxuan.php。
# 密钥：必填。xxd和后端服务器通信的密钥，需要和后端服务器中的设置保持一致。
# 是否默认服务器：选填。是默认服务器时填写default，否则不用填写。如果只配置了一台后端服务器，必须填写。如果客户端的登录地址不填写后端服务器名称，则连接到默认的后端服务器。
#
# 如果配置了多个后端服务器，则要保证xxd到每个后端服务器的网络连接都是通的，否则xxd无法启动。
#
# 下面是后端服务器的配置示例：
xuanxuan=http://127.0.0.1/xxb/xuanxuan.php,88888888888888888888888888888888,default
# ranzhi=http://demo.ranzhi.net/xuanxuan.php,88888888888888888888888888888888
# localhost=http://192.168.1.100/xxb/xuanxuan.php,88888888888888888888888888888888

[log]
# 程序运行日志的保存路径。
logPath=log/

[certificate]
# 证书的保存路径，默认情况下xxd会生成自签名证书。
# 使用官方认证的证书时，将官方认证的证书保存在此目录下，并且名称和xxd生成的证书保持一致。
crtPath=certificate/
```

该示例配置文件的最新版本参考 [xxd/config/xxd.conf](${repository.sourceUrl}xxd/config/xxd.conf)。

!> 特别提示：配置项中的 `isHttps` 虽然可以设置为 `0` 进行关闭，但不能在生成环境中关闭安全协议，否则加密机制不会生效。为了保证安全性，应该尽量使用随机字符串作为密匙。

### 3. 启动服务器

配置文件设置好之后就可以启动 XXD 服务器了。在不同的平台中命令行程序的使用各有不同：

<!-- tabs:start -->

#### ** Windows **

在命令行窗口程序或 PowerShell 中进入 XXD 程序包目录，执行如下命令启动服务器：

```bash
./xxd.exe
```

如果需要开机启动和后台执行，请把启动命令加入到计划任务中。

#### ** Linux 或 Mac **

在命令行终端中执行如下命令启动服务器：

```bash
$ ./xxd
```

需要开机启动和后台执行，请把启动命令加入到 `/etc/rc.d/rc.local` 文件的最后：

```
# rc.local
/xxdPath/xxd &
```

<!-- tabs:end -->

当 XXD 服务器启动成功后会在命令行输出服务器相关信息。例如：

```
XXD v${version} is running
System: darwin-amd64
----------------------------------------
Listen IP:  192.168.0.109
Websocket port:  11444
Http port:  11443
```

!> 注意：命令行程序只有在运行时才会维持 XXD 服务，启动之后除非要停止服务器，否则不要关闭命令行窗口，也不要退出命令行程序。

?> 要退出命令行窗口中正在执行的程序可以尝试使用快捷键 <kbd>Ctrl+C</kbd> 或 <kbd>Ctrl+D</kbd>，或者直接关闭命令行窗口。

### 4. 配置证书

首次运行 XXD 服务会在 XXD 命令行程序所在目录生成 `xxd/certificate` 目录（该目录可以在配置文件 `[certificate].crtPath` 字段进行设置），服务会自动生成 `main.key` 和 `main.crt` 这两个证书文件。此证书非官方签发证书，当使用浏览器端版本访问 XXD 服务器时可能会被拦截导致请求失败。如果已购买有官方签发的证书，只需要将证书放在在 `xxd/certificate` 目录内覆盖自动生成的证书文件即可（注意证书的格式和文件名）。

### 5. 调试

如果启动服务器过程中遇到问题，请查看 `xxd/logs` 目录下对应日期的日志文件（例如 `main_20181123.log`），安装提示解决问题。如果遇到无法解决的问题，欢迎访问 [问题反馈](start/feedback) 页面按照指引反馈你的问题。
