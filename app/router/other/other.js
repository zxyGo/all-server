module.exports = app => {
  const apiBlogRouter = app.router.namespace('/api/other');
  const {controller} = app;
  apiBlogRouter.post('/addUrl', controller.other.addUrl); // 业务添加接口连接
  apiBlogRouter.get('/urlList', controller.other.urlList); // 获取接口连接
  apiBlogRouter.post('/deleteUrl', controller.other.deleteUrl); // 删除接口连接
}