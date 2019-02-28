const router = require('koa-router')({
  prefix: '/api'
});
const controller = require('../controller/c-signin');
//登录
router.post('/signin', controller.postSignin);
//获取用户详情
router.get('/userInfo', controller.getUserInfo);
//根据名称查询用户详情
router.get('/userInfoByName', controller.getUserInfoByName);

//修改用户详情
router.put('/putUserInfo', controller.putUserInfo);
//修改用户密码
router.put('/updateUserPs', controller.putUpdateUserPs);


module.exports = router;