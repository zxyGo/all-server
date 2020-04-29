// 路由映射
module.exports = app => {
  const apiOcrRouter = app.router.namespace('/api/ocr');
  const {controller} = app;

  apiOcrRouter.post('/IdCard', controller.ocr.IdCard); // 身份证识别
  // apiNovelRouter.post('/test', controller.novel.testNovel); // 添加新的小说
}
