module.exports = app => {
  const apiBlogRouter = app.router.namespace('/api/blog');
  const {controller} = app;
  apiBlogRouter.get('/list', controller.blog.list); // 博客列表
  apiBlogRouter.get('/detail', controller.blog.detail); // 获取博客详情
  apiBlogRouter.get('/tags', controller.blog.tags); // 获取博客标签
  apiBlogRouter.get('/search', controller.blog.searchBlog); // 模糊搜索博客
  apiBlogRouter.get('/tagOne', controller.blog.tagOne); // 根据博客标签查找博客内容
}
