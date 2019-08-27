module.exports = app => {
  const apiUserRouter = app.router.namespace('/api/user');
  const {controller} = app;
  apiUserRouter.post('/login', controller.user.login); // 登录
  apiUserRouter.post('/register', controller.user.register); // 注册
  apiUserRouter.get('/info', controller.user.info); // 用户信息
}