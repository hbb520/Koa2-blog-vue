var mysql = require('mysql');
var config = require('../config/default.js');

var pool = mysql.createPool({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  port: config.database.PORT
});

let query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
          connection.release();
        });
      }
    });
  });
};

let users =
  `create table if not exists users(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL COMMENT '用户名',
     pass VARCHAR(100) NOT NULL COMMENT '密码',
     avator VARCHAR(100)  NULL COMMENT '头像',
     nickname VARCHAR(100) NOT NULL COMMENT '昵称',
     lives_in_city VARCHAR(100)  NULL COMMENT '现居城市',
     introduction VARCHAR(1000)  NULL COMMENT '简介,介绍',
     moment VARCHAR(100) NOT NULL COMMENT '注册时间',
     PRIMARY KEY ( id )
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;`;

let posts =
  `create table if not exists posts(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL COMMENT '文章作者',
     title TEXT(0) NOT NULL COMMENT '文章题目',
     content LONGTEXT NOT NULL COMMENT '文章内容',
     tag TEXT(0)  NULL COMMENT '文章标签',
     is_recommend INT  NOT NULL DEFAULT 0 COMMENT '是否为推荐,0为未推荐,1为推荐',
     uid VARCHAR(40) NOT NULL COMMENT '用户id',
     moment VARCHAR(100) NOT NULL COMMENT '发表时间',
     comments VARCHAR(200) NOT NULL DEFAULT '0' COMMENT '文章评论数',
     pv VARCHAR(40) NOT NULL DEFAULT '0' COMMENT '浏览量',
     avator VARCHAR(100) NOT NULL COMMENT '用户头像',
     PRIMARY KEY(id)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;`;

let comment =
  `create table if not exists comment(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL COMMENT '用户名称',
     content LONGTEXT NOT NULL COMMENT '评论内容',
     moment VARCHAR(40) NOT NULL COMMENT '评论时间',
     postid VARCHAR(40) NOT NULL COMMENT '文章id',
     avator VARCHAR(100) NOT NULL COMMENT '用户头像',
     PRIMARY KEY(id) 
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;`;

let createTable = (sql) => {
  return query(sql, []);
};

// 建表
createTable(users);
createTable(posts);
createTable(comment);

// 注册用户
exports.insertData = (value) => {
  let _sql = 'insert into users set name=?,pass=?,nickname=?,moment=?;';
  return query(_sql, value);
};
// 删除用户
exports.deleteUserData = (name) => {
  let _sql = `delete from users where name="${name}";`;
  return query(_sql);
};
// 查找用户
exports.findUserData = (name) => {
  let _sql = `select * from users where name="${name}";`;
  return query(_sql);
};
// 发表文章
exports.insertPost = (value) => {
  let _sql = 'insert into posts set name=?,title=?,content=?,tag=?,uid=?,moment=?,avator=?;';
  return query(_sql, value);
};
// 增加文章评论数
exports.addPostCommentCount = (value) => {
  let _sql = 'update posts set comments = comments + 1 where id=?';
  return query(_sql, value);
};
// 减少文章评论数
exports.reducePostCommentCount = (value) => {
  let _sql = 'update posts set comments = comments - 1 where id=?';
  return query(_sql, value);
};

// 更新浏览数
exports.updatePostPv = (value) => {
  let _sql = 'update posts set pv= pv + 1 where id=?';
  return query(_sql, value);
};

// 发表评论
exports.insertComment = (value) => {
  let _sql = 'insert into comment set name=?,content=?,moment=?,postid=?,avator=?;';
  return query(_sql, value);
};
// 通过名字查找用户
exports.findDataByName = (name) => {
  let _sql = `select * from users where name="${name}";`;
  return query(_sql);
};
// 通过名字查找用户数量判断是否已经存在
exports.findDataCountByName = (name) => {
  let _sql = `select count(*) as count from users where name="${name}";`;
  return query(_sql);
};
// 通过文章的名字查找用户
exports.findDataByUser = (name) => {
  let _sql = `select * from posts where name="${name}";`;
  return query(_sql);
};
// 通过文章id查找
exports.findDataById = (id) => {
  let _sql = `select * from posts where id="${id}";`;
  return query(_sql);
};
// 通过文章id查找
exports.findCommentById = (id) => {
  let _sql = `select * from comment where postid="${id}";`;
  return query(_sql);
};

// 通过文章id查找评论数
exports.findCommentCountById = (id) => {
  let _sql = `select count(*) as count from comment where postid="${id}";`;
  return query(_sql);
};

// 通过评论id查找
exports.findComment = (id) => {
  let _sql = `select * from comment where id="${id}";`;
  return query(_sql);
};
// 查询所有文章
exports.findAllPost = () => {
  let _sql = `select * from posts;`;
  return query(_sql);
};
// 查询所有文章数量
exports.findAllPostCount = () => {
  let _sql = `select count(*) as count from posts;`;
  return query(_sql);
};
// 查询分页文章
exports.findPostByPage = (title, tag, page, is_recommend) => {
  let _sql = ``;
  if (title && tag) {
    if (is_recommend == 0) {
      _sql = `select * from posts where  title like '%${title}%' and  tag like '%${tag}%'   order by moment desc limit ${(page - 1) * 20},20;`;
    } else {
      _sql = `select * from posts where  title like '%${title}%' and  tag like '%${tag}%' and  is_recommend=1   order by moment desc limit ${(page - 1) * 20},20;`;
    }
  } else if (title == null && tag != null) {
    if (is_recommend == 0) {
      _sql = `select * from posts where  tag like '%${tag}%'   order by moment desc limit ${(page - 1) * 20},20;`;
    } else {
      _sql = `select * from posts where  tag like '%${tag}%' and  is_recommend=1   order by moment desc limit ${(page - 1) * 20},20;`;
    }
  } else if (title != null && tag == null) {
    if (is_recommend == 0) {
      _sql = `select * from posts where  title like '%${title}%'  order by moment desc limit ${(page - 1) * 20},20;`;
    } else {
      _sql = `select * from posts where  title like '%${title}%'  and  is_recommend=1  order by moment desc limit ${(page - 1) * 20},20;`;
    }
  } else {
    if (is_recommend == 0) {
      _sql = `select * from posts   order by moment desc  limit ${(page - 1) * 20},20;`;
    } else {
      _sql = `select * from posts  where  is_recommend=1  order by moment desc  limit ${(page - 1) * 20},20;`;
    }
  }
  return query(_sql);
};
// 查询所有个人用户文章数量
exports.findPostCountByName = (name) => {
  let _sql = `select count(*)  as count  from posts where name="${name}";`;
  return query(_sql);
};
// 查询个人分页文章
exports.findPostByUserPage = (name, page) => {
  let _sql = ` select * from posts where name="${name}" order by moment desc limit ${(page - 1) * 10},10 ;`;
  return query(_sql);
};
// 更新修改文章
exports.updatePost = (values) => {
  let _sql = `update posts set title=?,content=?,tag=?,moment=? where id=?`;
  return query(_sql, values);
};
//推荐
exports.updatePostRecommend = (values) => {
  let _sql = `update posts set is_recommend=? where id=?`;
  return query(_sql, values);
};
//取消推荐
exports.updatePostCancelRecommend = (values) => {
  let _sql = `update posts set is_recommend=? where id=?`;
  return query(_sql, values);
};

// 删除文章
exports.deletePost = (id) => {
  let _sql = `delete from posts where id = ${id}`;
  return query(_sql);
};
// 删除评论
exports.deleteComment = (id) => {
  let _sql = `delete from comment where id=${id}`;
  return query(_sql);
};
// 删除所有评论
exports.deleteAllPostComment = (id) => {
  let _sql = `delete from comment where postid=${id}`;
  return query(_sql);
};

// 滚动无限加载数据
exports.findPageById = (page) => {
  let _sql = `select * from posts limit ${(page - 1) * 5},5;`;
  return query(_sql);
};
// 评论分页
exports.findCommentByPage = (page, postId) => {
  let _sql = `select * from comment where postid=${postId} order by moment asc limit ${(page - 1) * 10},10;`;
  return query(_sql);
};

// 通过用户id查找
exports.findUserById = (id) => {
  let _sql = `select * from users where id="${id}";`;
  return query(_sql);
};
// 通过用户名称查找
exports.findUserByName = (name) => {
  let _sql = `select * from users where name="${name}";`;
  return query(_sql);
};
// 更新用户
exports.updateUser = (values) => {
  let _sql = `update users set avator=?,nickname=?,lives_in_city=?,introduction=? where id=?`;
  return query(_sql, values);
};

// 更新密码
exports.updateUserPs = (values) => {
  let _sql = `update users set pass=? where id=?`;
  return query(_sql, values);
};