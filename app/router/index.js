// 路由映射
module.exports = app => {
  const apiNovelRouter = app.router.namespace('/api/common');
  const {controller} = app;
  // apiNovelRouter.get('/github', controller.common.github);
}