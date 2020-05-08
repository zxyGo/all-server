module.exports = app => {
  const apiBlogRouter = app.router.namespace('/api/blog');
  const {controller} = app;
  apiBlogRouter.get('/list', controller.blog.blog.list); // 博客列表
  apiBlogRouter.get('/detail', controller.blog.blog.detail); // 获取博客详情
  apiBlogRouter.get('/tags', controller.blog.blog.tags); // 获取博客标签
  apiBlogRouter.get('/search', controller.blog.blog.searchBlog); // 模糊搜索博客
  apiBlogRouter.get('/tagOne', controller.blog.blog.tagOne); // 根据博客标签查找博客内容
  apiBlogRouter.post('/add', controller.blog.blog.addBLog); // 添加博客
  apiBlogRouter.post('/update', controller.blog.blog.updateBlog); // 添加博客
  apiBlogRouter.post('/delete', controller.blog.blog.deleteBlog); // 删除博客

}
