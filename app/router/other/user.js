module.exports = app => {
  const apiUserRouter = app.router.namespace('/api/user');
  const {controller} = app;
  apiUserRouter.post('/login', controller.other.user.login); // 登录
  apiUserRouter.post('/register', controller.other.user.register); // 注册
  apiUserRouter.get('/info', controller.other.user.info); // 用户信息
}
