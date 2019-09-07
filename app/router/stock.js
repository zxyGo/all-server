module.exports = app => {
  const apiStockRouter = app.router.namespace('/api/stock');
  const {controller} = app;
  apiStockRouter.get('/list', controller.stock.list); // 股票添加
  apiStockRouter.post('/add', controller.stock.add); // 股票添加
  apiStockRouter.post('/update', controller.stock.update); // 股票修改
  apiStockRouter.post('/delete', controller.stock.delete); // 股票删除
}