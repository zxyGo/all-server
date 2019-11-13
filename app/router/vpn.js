module.exports = app => {
  const apiVpnRouter = app.router.namespace('/api/vpn');
  const { controller } = app;
  apiVpnRouter.get('/list', controller.vpn.list); // vpn用户列表
  apiVpnRouter.post('/add', controller.vpn.add); // vpn用户添加
  apiVpnRouter.post('/update', controller.vpn.update); // vpn用户修改
  apiVpnRouter.post('/delete', controller.vpn.delete); // vpn用户删除
}
