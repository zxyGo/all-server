// 路由映射
module.exports = app => {
  const apiNovelRouter = app.router.namespace('/api/novel');
  const {controller} = app;
  apiNovelRouter.get('/list', controller.other.novel.list);
  apiNovelRouter.get('/chapterList', controller.other.novel.chapterList);
  apiNovelRouter.get('/content', controller.other.novel.content);
  // 存储用户ip
  apiNovelRouter.get('/saveIp', controller.other.novel.saveIp);
  apiNovelRouter.post('/needNovel', controller.other.novel.needNovel); // 储存用户需要添加的小说
  apiNovelRouter.get('/userValid', controller.other.novel.isValid); // 判断用户登录信息是否有效

  apiNovelRouter.post('/addNovel', controller.other.novel.add_novel); // 添加新的小说
  apiNovelRouter.post('/test', controller.other.novel.testNovel); // 添加新的小说
}
