---
title: 命令行 MySQL 基本操作(CentOS)
pubDate: 2020-07-24 10:54:53
categories: ["MySQL", "CentOS"]
description: ""
---

## 安装

```
$ brew install mysql
```

## 登录

```
$ mysql -uroot -p
```

连接到 mysql 数据库，默认没有密码的，直接按回车进入。

## 启动数据库

```
$ service mysqld start
```

## 停止数据库

```
$ service mysqld stop
```

## 重启数据库

```
$ service mysqld restart 
```

## 显示所有数据库

```
$ show databases;
```

![image](https://user-images.githubusercontent.com/16217324/88373512-8e237e00-cdca-11ea-9f5f-a97a5cd0aef4.png)

## 进入数据库

```
$ use mysql;
```

## 显示所有表

```
$ show tables;
```

![image](https://user-images.githubusercontent.com/16217324/88373543-9b406d00-cdca-11ea-83ab-dc217892ffd7.png)

## 创建表名和字段

```
$ CREATE TABLE data (images VARCHAR(20));
```

## 修改字段大小

```
$ ALTER TABLE data images MODIFY VARCHAR(100);
```

## 查询表

```
$ select * from card;
```

## 修改用户密码

```
$ mysql -u root -p

$ show databases;

$ use mysql;

$ desc user;  # 用户表存放用户和面膜

$ update user set authentication_string=PASSWORD('123') where user = 'root';
```
