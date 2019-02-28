const router = require('koa-router')({
  prefix: '/api'
});
const controller = require('../controller/c-signup')
// post 注册
router.post('/signup', controller.postSignup)
//上传
router.post('/upload', controller.postUpload)

module.exports = router