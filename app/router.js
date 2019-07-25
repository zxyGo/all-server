// 路由映射
module.exports = app => {
  require('./router/novel')(app);
  // const { router, controller} = app;
  // router.get('/', controller.home.index);
 
  // router.get('/news', controller.news.list);
}