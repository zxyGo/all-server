module.exports = app => {
  const apiStockRouter = app.router.namespace('/api/stock');
  const {controller} = app;
  apiStockRouter.get('/list', controller.other.stock.list); // 股票列表
  apiStockRouter.post('/add', controller.other.stock.add); // 股票添加
  apiStockRouter.post('/update', controller.other.stock.update); // 股票修改
  apiStockRouter.post('/delete', controller.other.stock.delete); // 股票删除
}
