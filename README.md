## 使用说明

一. 将`config.js.sample`文件名修改为`config.js`，并填写数据库连接信息.

二. 在当前项目目录，通过命令行进入数据库:

```
  mysql -uusername -ppassword -hhost -Pport
```

在mysql命令行下创建数据库并初始化数据库结构:

```
  create database benchmark(与配置文件一致);

  source init.sql;
```

三. 退出MySQL命令行，在项目根目录启动NodeJS项目：

```
  npm install
  nohup node server.js &
```
