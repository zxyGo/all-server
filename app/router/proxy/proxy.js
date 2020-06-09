module.exports = app => {
  const apiProxyRouter = app.router.namespace('/api/proxy');
  const { controller } = app;
  apiProxyRouter.get('/subscribe', controller.proxy.proxy.subscribe); // 代理订阅
}
