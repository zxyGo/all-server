/**
 * 股票相关
 */
const Controller = require('egg').Controller;

class StockController extends Controller {
  async add() {
    const { app, ctx, service } = this;
    const rule = {
      code: 'string',
      preValue: 'string',
      content: 'string',
      adjust: 'string'
    }
    const errors = app.validator.validate(rule, ctx.request.body);
    if (errors) {
      return ctx.helper.lackData(errors);
    }
    const reqData = ctx.request.body;
    const data = await service.stock.add(reqData);
    if (data) {
      ctx.helper.successRes(data);
    } else {
      ctx.helper.mysqlError();
    }
  }

  async update() {
    const { app, ctx, service } = this;
    const rule = {
      stockId: 'string',
      preValue: 'string',
      content: 'string',
      adjust: 'string'
    }
    const errors = app.validator.validate(rule, ctx.request.body);
    if (errors) {
      return ctx.helper.lackData(errors);
    }
    const reqData = ctx.request.body;
    const data = await service.stock.update(reqData);
    if (data) {
      ctx.helper.successRes(data);
    } else {
      ctx.helper.mysqlError();
    }
  }


  async delete() {
    const { app, ctx, service } = this;
    const rule = {
      stockId: 'string'
    }
    const errors = app.validator.validate(rule, ctx.request.body);
    if (errors) {
      return ctx.helper.lackData(errors);
    }
    const reqData = ctx.request.body;
    const data = await service.stock.delete(reqData);
    if (data) {
      ctx.helper.successRes(data);
    } else {
      ctx.helper.mysqlError();
    }
  }


  async list() {
    const { ctx, service } = this;
    const data = await service.stock.list();
    if (data) {
      ctx.helper.successRes(data);
    } else {
      ctx.helper.mysqlError();
    }
  }
}

module.exports = StockController;