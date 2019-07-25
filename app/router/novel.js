// 路由映射
module.exports = app => {
  const apiNovelRouter = app.router.namespace('/api/novel');
  const {controller} = app;
  apiNovelRouter.get('/list', controller.novel.list);
  apiNovelRouter.get('/chapterList', controller.novel.chapterList);
  apiNovelRouter.get('/content', controller.novel.content);
  // 存储用户ip
  apiNovelRouter.get('/saveIp', controller.novel.saveIp);
  apiNovelRouter.post('/needNovel', controller.novel.needNovel); // 储存用户需要添加的小说
  apiNovelRouter.get('/userValid', controller.novel.isValid); // 判断用户登录信息是否有效

  apiNovelRouter.post('/addNovel', controller.novel.add_novel); // 添加新的小说
}