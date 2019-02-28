const router = require('koa-router')({
  prefix: '/api'
});

router.get('/signout', async(ctx, next) => {
    ctx.session = null;
    ctx.body = true
})

module.exports = router