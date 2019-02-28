const router = require('koa-router')({
  prefix: '/api'
});
const controller = require('../controller/c-posts');
// 首页分页，每次输出20条
router.post('/posts/page', controller.postPostsPage);
// 查询所有文章数量
router.get('/posts/page/total', controller.getfindAllPostCount);
// 个人文章分页，每次输出10条
router.post('/posts/self/page', controller.postSelfPage);
// 单篇文章详情
router.get('/postId/:postId', controller.getPostId);
// post 发表文章
router.post('/create', controller.postCreate);
// 发表评论
router.post('/comment', controller.postComment);
// post 编辑单篇文章
router.put('/posts/edit', controller.putEditPage);
// 删除单篇文章
router.delete('/posts/remove/:postId', controller.postDeletePost);
// 删除评论
router.post('/comment/remove', controller.postDeleteComment);
// 评论分页
router.post('/commentPage', controller.postCommentPage);
//推荐
router.post('/recommend', controller.postRecommend);
//取消推荐
router.post('/cancelRecommend', controller.postCancelRecommend);

module.exports = router;