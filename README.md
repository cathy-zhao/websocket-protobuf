# 概述

- 本项目开发环境采用 [NodeJS](http://nodejs.org) 搭建，你的电脑上必须先要安装 NodeJS。
- [NPM](https://www.npmjs.org/) 是 NodeJS 的模块管理系统，本项目所有依赖的第三方模块都通过 NPM 来进行安装。

# 安装开发环境


# 准备开始

- 首先克隆代码到本地

```bash
$ git clone https://github.com/cathy-zhao/websocket-protobuf.git <my-project-name>
$ cd <my-project-name>
```

- 然后安装依赖，执行编译命令

```bash
$ npm install   # 安装项目需要的依赖
$ npm start     # 打包编译, 并开启一个开发环境的服务器
```

- 编译打包无误后，访问 http://127.0.0.1:8000/ 就可以看到项目文件

# 开发

- 修改源代码
- 观察 webpack -w 界面是否正确生成了更新的文件
- 用浏览器查看运行效果，调试你的代码

