Koa2-blog-vue (欢迎star),

#欢迎小伙伴一起学习,QQ群652359243

此项目是学习wclimb大佬的Koa2-blog,然后自己将接口全都暴露出来并丰富了一些东西,

比如:增删改查,登录注册,修改详情

Koa2-blog-vue暴露出来的API也将用于开发各个端的项目,比如PC端,移动H5端,小程序端,混合app端,桌面端

关于node开发博客类型网站学习:

教程 [Koa2-blog](https://github.com/wclimb/Koa2-blog)

教程 [Node+Koa2+Mysql 搭建简易博客](http://www.wclimb.site/2017/07/12/Node-Koa2-Mysql-%E6%90%AD%E5%BB%BA%E7%AE%80%E6%98%93%E5%8D%9A%E5%AE%A2/)

教程 [node项目服务器部署新手教程](http://www.wclimb.site/2018/07/28/node%E9%A1%B9%E7%9B%AE%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%83%A8%E7%BD%B2-%E6%96%B0%E6%89%8B%E6%95%99%E7%A8%8B/)

教程 [Koa2进阶学习笔记](https://chenshenhai.github.io/koa2-note/)

教程 [N-blog 《一起学 Node.js》](https://github.com/nswbmw/N-blog)
### 创建数据库 

登录数据库
```
$ mysql -u root -p
```
创建数据库
```
$ create database nodesql;
```
使用创建的数据库
```
$ use nodesql;
```

> database: nodesql  tables: users posts comment  (已经在lib/mysql建表)


| users   | posts    |  comment  |
| :----: | :----:   | :----: |
|   id    |   id    |   id    |
|   name    |   name    |   name    |
|   pass    |   title    |   content    |
|   avator     | content      |   moment    |
|    moment     | md      |    postid   |
|     -    | uid      |   avator    |
|     -    | moment      |    -   |
|     -   | comments      |    -   |      
|     -   | pv             |   -   |      
|     -   |  avator       |    -   |    


* id主键递增
* name: 用户名
* pass：密码
* avator：头像
* title：文章标题
* content：文章内容和评论
* md：markdown语法
* uid：发表文章的用户id 
* moment：创建时间
* comments：文章评论数
* pv：文章浏览数
* postid：文章id

```
$ git clone https://github.com/wclimb/Koa2-blog.git
```
```
$ cd Koa2-blog
```
```
$ cnpm i supervisor -g
```
```
$ cnpm i 
```
```
$ npm run dev(运行项目)
```
```
$ npm test(测试项目)
```
