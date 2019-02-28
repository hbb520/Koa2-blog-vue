const userModel = require('../lib/mysql.js');
const md5 = require('md5');
const checkNotLogin = require('../middlewares/check.js').checkNotLogin;
const checkLogin = require('../middlewares/check.js').checkLogin;
/**
 * 登录
 * @author hbb
 * @param
 */
exports.postSignin = async ctx => {
  let {name, password} = ctx.request.body;
  await userModel.findDataByName(name)
    .then(result => {
      let res = result;
      if (res.length && name === res[0]['name'] && md5(password) === res[0]['pass']) {
        ctx.session = {
          user: res[0]['name'],
          id: res[0]['id']
        };
        ctx.body = {
          code: 200,
          username: result[0].name,
          avator: result[0].avator,
          message: '登录成功'
        };
        console.log('session', ctx.session);
      } else {
        ctx.body = {
          code: 500,
          message: '用户名或密码错误'
        };
        console.log('用户名或密码错误!');
      }
    }).catch(err => {
      console.log(err);
    });

};


/**
 * 获取用户详情
 * @param
 */
exports.getUserInfo = async ctx => {
  if (!ctx.session || !ctx.session.user) {
    ctx.status = 401,
      ctx.body = {
        code: 401,
        message: '登录失效',
      };
    return false;
  }
  let id = ctx.session.id;
  await userModel.findUserById(id)
    .then(result => {
      let resultData = result[0];
      ctx.body = {
        code: 200,
        data: {
          id: resultData.id,
          name: resultData.name,
          avator: resultData.avator,
          moment: resultData.moment,
          nickname: resultData.nickname,
          lives_in_city: resultData.lives_in_city,
          introduction: resultData.introduction,
        },
        message: '查询成功'
      };
    });
};

/**
 * 获取用户详情
 * @param
 */
exports.getUserInfoByName = async ctx => {
  if (!ctx.session || !ctx.session.user) {
    ctx.status = 401,
      ctx.body = {
        code: 401,
        message: '登录失效',
      };
    return false;
  }
  let name = ctx.query.name;
  await userModel.findUserByName(name)
    .then(result => {
      let resultData = result[0];
      ctx.body = {
        code: 200,
        data: {
          id: resultData.id,
          name: resultData.name,
          avator: resultData.avator,
          moment: resultData.moment,
          nickname: resultData.nickname,
          lives_in_city: resultData.lives_in_city,
          introduction: resultData.introduction,
        },
        message: '查询成功'
      };
    });
};

/**
 * 修改用户信息
 * @author hbb
 * @param
 */

exports.putUserInfo = async ctx => {
  if (!ctx.session || !ctx.session.user) {
    ctx.status = 401,
      ctx.body = {
        code: 401,
        message: '登录失效',
      };
    return false;
  }
  let avator = ctx.request.body.avator,
    nickname = ctx.request.body.nickname,
    lives_in_city = ctx.request.body.lives_in_city,
    introduction = ctx.request.body.introduction,
    id = ctx.session.id;
  await userModel.updateUser([avator, nickname, lives_in_city, introduction, id])
    .then(() => {
      ctx.body = {
        code: 200,
        message: '修改成功'
      };
    }).catch(() => {
      ctx.body = {
        code: 500,
        message: '修改失败'
      };
    });

};
/**
 * 修改用户密码
 * @author hbb
 * @param
 */

exports.putUpdateUserPs = async ctx => {
  if (!ctx.session || !ctx.session.user) {
    ctx.status = 401,
      ctx.body = {
        code: 401,
        message: '登录失效',
      };
    return false;
  }
  let {oldPassword, newPassword, repeatpass} = ctx.request.body,
    id = ctx.session.id,
    name = ctx.session.name;
  if (newPassword !== repeatpass || newPassword.trim() === '') {
    ctx.body = {
      code: 500,
      message: '两次输入的密码不一致'
    };
    return;
  }
  await userModel.findUserById(id)
    .then(async (result) => {
      if (md5(oldPassword) != result[0].pass) {
        ctx.body = {
          code: 500,
          message: '原始密码错误'
        };
      } else {
        await userModel.updateUserPs([md5(newPassword), id])
          .then(() => {
            ctx.body = {
              code: 200,
              message: '修改成功'
            };
          }).catch(() => {
            ctx.body = {
              code: 500,
              message: '修改失败'
            };
          });
      }
    });


};