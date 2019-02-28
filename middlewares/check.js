module.exports = {
  // 已经登录了
  checkNotLogin: (ctx) => {
    if (ctx.session && ctx.session.user) {
      ctx.redirect('/posts');
      return false;
    }
    return true;
  },
  //没有登录
  checkLogin: (ctx) => {
    if (!ctx.session || !ctx.session.user) {
      ctx.status = 401,
        ctx.body = {
          code: 401,
          message: '登录失效',
        };
      return false;
    }
    return true;
  }
};
