const userModel = require('../lib/mysql.js');
const md5 = require('md5');
const checkNotLogin = require('../middlewares/check.js').checkNotLogin;
const checkLogin = require('../middlewares/check.js').checkLogin;
const moment = require('moment');
const fs = require('fs');
const path = require('path');
/**
 * 注册
 * @author hbb
 * @param
 */
exports.postSignup = async ctx => {
  let {name, password, repeatpass} = ctx.request.body;
  await userModel.findDataCountByName(name)
    .then(async (result) => {
      if (result[0].count >= 1) {
        // 用户存在
        ctx.body = {
          code: 500,
          message: '用户存在'
        };
      } else if (password !== repeatpass || password.trim() === '') {
        ctx.body = {
          code: 500,
          message: '两次输入的密码不一致'
        };
      } else {
        await userModel.insertData([name, md5(password), name, moment().format('YYYY-MM-DD HH:mm:ss')])
          .then(res => {
            //注册成功
            ctx.body = {
              code: 200,
              message: '注册成功'
            };
          });
      }
    });
};

/**
 * 上传文件
 * @author hbb
 * @param
 */
exports.postUpload = async ctx => {
  // 上传单个文件;
  const file = ctx.request.files.file; // 获取上传文件
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  let filePath = path.join(__dirname, '../public/images/') + `${file.name}`;
  // 创建可写流
  const upStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  return ctx.body = {
    code: 200,
    message: '上传成功',
    url: '/images/' + `${file.name}`
  };
};