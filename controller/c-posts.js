const userModel = require('../lib/mysql.js');
const moment = require('moment');
const checkNotLogin = require('../middlewares/check.js').checkNotLogin;
const checkLogin = require('../middlewares/check.js').checkLogin;
const md = require('markdown-it')();

/**
 * 获取首页分页， 每次输出20条
 * @author hbb
 * @param
 */
exports.postPostsPage = async (ctx) => {
  let data = ctx.request.body;
  let total = 0;
  await userModel.findAllPostCount()
    .then(result => {
      total = result[0].count;
    }).catch(() => {
    });
  await userModel.findPostByPage(data.title, data.tag, data.page, data.is_recommend)
    .then(result => {
      //image_list处理 输出 image_list数组
      let imgReg = /<img.*?(?:>|\/>)/gi;
      let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;

      for (let i = 0; i < result.length; i++) {
        let arr = [];
        arr = result[i].content.match(imgReg); // arr 为包含所有img标签的数组
        let src = []
        if (arr == null) {
          result[i].image_list = [];
        } else {
          for (let m = 0; m < arr.length; m++) {
            src.push(arr[m].match(srcReg)[1]);
          }
          result[i].image_list = src;
        }

        //时间处理 输出 momentStr
        let timespan = result[i].moment
        let dateTime = new Date(timespan);
        let dateTime_1 = dateTime.getTime();
        let now = new Date();
        let now_new = now.getTime(); //typescript转换写法
        let milliseconds = 0;
        let timeSpanStr;
        milliseconds = parseInt(now_new) - parseInt(dateTime_1);
        if (milliseconds <= 1000 * 60 * 1) {
          timeSpanStr = '刚刚';
        } else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
          timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
        } else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
          timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
        } else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
          timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
        } else if (milliseconds > 1000 * 60 * 60 * 24 * 15) {
          timeSpanStr = timespan;
        }
        result[i].momentStr = timeSpanStr
      }

      ctx.status = 200,
        ctx.body = {
          code: 200,
          message: '获取成功',
          data: result,
          total: total
        };
    }).catch(() => {
      ctx.body = 'error';
    });


};


/**
 * 获取首页文章总数
 * @author hbb
 * @param
 */
exports.getfindAllPostCount = async (ctx) => {
  await userModel.findAllPostCount()
    .then(result => {
      ctx.status = 200,
        ctx.body = result;
    }).catch(() => {
      ctx.body = 'error';
    });


};
/**
 * 获取个人文章分页， 每次输出10条
 * @author hbb
 * @param
 */
exports.postSelfPage = async ctx => {
  console.log(ctx.session);
  if (!ctx.session || !ctx.session.user) {
    ctx.status = 401,
      ctx.body = {
        code: 401,
        message: '登录失效',
      };
    return false;
  }

  let data = ctx.request.body;
  let postCount = 0;

  await userModel.findPostCountByName(ctx.session.user)
    .then(result => {
      postCount = result[0].count;
    });
  await userModel.findPostByUserPage(decodeURIComponent(ctx.session.user), data.page)
    .then(result => {
      ctx.status = 200,
        ctx.body = {
          code: 200,
          message: '获取成功',
          data: result,
          total: postCount
        };
    }).catch(() => {
      ctx.body = 'error';
    });
};
/**
 * 发表文章
 * @author hbb
 * @param
 */

exports.postCreate = async ctx => {
  if (!ctx.session || !ctx.session.user) {
    ctx.status = 401,
      ctx.body = {
        code: 401,
        message: '登录失效',
      };
    return false;
  }
  console.log(ctx.session);
  let data = ctx.request.body,
    id = ctx.session.id,
    name = ctx.session.user,
    time = moment().format('YYYY-MM-DD HH:mm:ss'),
    avator;
  await userModel.findUserData(ctx.session.user)
    .then(res => {
      avator = res[0]['avator'];
    });
  await userModel.insertPost([name, data.title, data.content, data.tag, id, time, avator])
    .then(() => {
      ctx.body = {
        code: 200,
        message: '发表文章成功'
      };
    }).catch(() => {
      ctx.body = {
        code: 500,
        message: '发表文章失败'
      };
    });
};
/**
 * 发表评论
 * @author hbb
 * @param
 */
exports.postComment = async ctx => {
  if (!ctx.session || !ctx.session.user) {
    ctx.status = 401,
      ctx.body = {
        code: 401,
        message: '登录失效',
      };
    return false;
  }
  let name = ctx.session.user,
    content = ctx.request.body.content,
    postId = ctx.request.body.postId,
    time = moment().format('YYYY-MM-DD HH:mm:ss'),
    avator;
  await userModel.findUserData(ctx.session.user)
    .then(res => {
      avator = res[0]['avator'];
    });
  await userModel.insertComment([name, content, time, postId, avator]);
  await userModel.addPostCommentCount(postId)
    .then(() => {
      ctx.body = {
        code: 200,
        message: '评论成功'
      };
    }).catch(() => {
      ctx.body = {
        code: 500,
        message: '评论失败'
      };
    });
};
/**
 * 单查文章
 * @param
 */
exports.getPostId = async ctx => {
  let name = ctx.session.user,
    postId = ctx.params.postId,
    res;
  await userModel.findDataById(postId)
    .then(result => {
      ctx.body = {
        code: 200,
        data: result[0],
        message: '查询成功'
      };
    });
  await userModel.updatePostPv(postId);
};

/**
 * post 编辑单篇文章
 */
exports.putEditPage = async ctx => {
  if (!ctx.session || !ctx.session.user) {
    ctx.status = 401,
      ctx.body = {
        code: 401,
        message: '登录失效',
      };
    return false;
  }
  let title = ctx.request.body.title,
    content = ctx.request.body.content,
    postId = ctx.request.body.postId,
    tag = ctx.request.body.tag,
    time = moment().format('YYYY-MM-DD HH:mm:ss'),
    id = ctx.session.id,
    allowEdit = true;
  await userModel.findDataById(postId)
    .then(res => {
      if (res[0].name != ctx.session.user) {
        allowEdit = false;
      } else {
        allowEdit = true;
      }
    });
  if (allowEdit) {
    await userModel.updatePost([title, content, tag, time, postId])
      .then(() => {
        ctx.body = {
          code: 200,
          message: '编辑成功'
        };
      }).catch(() => {
        ctx.body = {
          code: 500,
          message: '编辑失败'
        };
      });
  } else {
    ctx.body = {
      code: 404,
      message: '无权限'
    };
  }
};
/**
 * 删除单篇文章
 */
exports.postDeletePost = async ctx => {
  if (!ctx.session || !ctx.session.user) {
    ctx.status = 401,
      ctx.body = {
        code: 401,
        message: '登录失效',
      };
    return false;
  }
  let postId = ctx.params.postId,
    allow;
  await userModel.findDataById(postId)
    .then(res => {
      if (res[0].name != ctx.session.user) {
        allow = false;
      } else {
        allow = true;
      }
    });
  if (allow) {
    await userModel.deleteAllPostComment(postId);
    await userModel.deletePost(postId)
      .then(() => {
        ctx.body = {
          code: 200,
          message: '删除文章成功'
        };
      }).catch(() => {
        ctx.body = {
          code: 500,
          message: '删除文章失败'
        };
      });
  } else {
    ctx.body = {
      code: 404,
      message: '无权限'
    };
  }
};
/**
 * 删除评论
 */
exports.postDeleteComment = async ctx => {
  if (!ctx.session || !ctx.session.user) {
    ctx.status = 401,
      ctx.body = {
        code: 401,
        message: '登录失效',
      };
    return false;
  }
  let postId = ctx.request.body.postId,
    commentId = ctx.request.body.commentId,
    allow;
  await userModel.findComment(commentId)
    .then(res => {
      if (res[0].name != ctx.session.user) {
        allow = false;
      } else {
        allow = true;
      }
    });
  if (allow) {
    await userModel.reducePostCommentCount(postId);
    await userModel.deleteComment(commentId)
      .then(() => {
        ctx.body = {
          code: 200,
          message: '删除评论成功'
        };
      }).catch(() => {
        ctx.body = {
          code: 500,
          message: '删除评论失败'
        };

      });
  } else {
    ctx.body = {
      code: 404,
      message: '无权限'
    };
  }
};
/**
 * 评论分页
 */
exports.postCommentPage = async function (ctx) {
  let postId = ctx.request.body.postId,
    page = ctx.request.body.page,
    count = 0;
  await userModel.findCommentCountById(postId)
    .then(result => {
      count = result[0].count;
    });

  await userModel.findCommentByPage(page, postId)
    .then(res => {
      ctx.body = {
        code: 200,
        message: '获取成功',
        data: res,
        total: count
      };
    }).catch(() => {
      ctx.body = 'error';
    });
};
/**
 * 推荐
 * @author hbb
 * @param
 */

exports.postRecommend = async ctx => {
  if (!ctx.session || !ctx.session.user) {
    ctx.status = 401,
      ctx.body = {
        code: 401,
        message: '登录失效',
      };
    return false;
  }
  let postId = ctx.request.body.postId,
    id = ctx.session.id,
    allowEdit = true;
  if (ctx.session.id != 1) {
    allowEdit = false;
  }
  if (allowEdit) {
    await userModel.updatePostRecommend([1, postId])
      .then(() => {
        ctx.body = {
          code: 200,
          message: '推荐成功'
        };
      }).catch(() => {
        ctx.body = {
          code: 500,
          message: '推荐失败'
        };
      });
  } else {
    ctx.body = {
      code: 404,
      message: '无权限'
    };
  }
};
/**
 * 取消推荐
 * @author hbb
 * @param
 */

exports.postCancelRecommend = async ctx => {
  if (!ctx.session || !ctx.session.user) {
    ctx.status = 401,
      ctx.body = {
        code: 401,
        message: '登录失效',
      };
    return false;
  }
  let postId = ctx.request.body.postId,
    id = ctx.session.id,
    allowEdit = true;
  if (ctx.session.id != 1) {
    allowEdit = false;
  }
  if (allowEdit) {
    await userModel.updatePostCancelRecommend([0, postId])
      .then(() => {
        ctx.body = {
          code: 200,
          message: '取消成功'
        };
      }).catch(() => {
        ctx.body = {
          code: 500,
          message: '取消推荐失败'
        };
      });
  } else {
    ctx.body = {
      code: 404,
      message: '无权限'
    };
  }
};

