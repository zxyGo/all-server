/**
 * 其他很杂的东西
 */
const Controller = require('egg').Controller;

class OtherController extends Controller {
  async addUrl() {
    const { ctx, service, app } = this;
    const token = ctx.get('x-token');
    const payload = app.jwt.verify(token, app.config.jwt.secret);
    if (!payload.name) {
      return {
        code: -1,
        message: 'token失效'
      }
    }
    const rule = {
      url: 'string'
    }
    const errors = app.validator.validate(rule, ctx.request.body);
    if (errors) {
      return ctx.helper.lackData(errors);
    }
    const { url } = ctx.request.body;
    const data = await service.other.addUrl(url);
    if (data) {
      ctx.helper.successRes(data)
    } else {
      ctx.helper.mysqlError();
    }
  }

  async urlList() {
    const { ctx, service } = this;
    const data = await service.other.urlList();
    if (data) {
      ctx.helper.successRes(data)
    } else {
      ctx.helper.mysqlError();
    }
  }
  async deleteUrl() {
    const { ctx, service, app } = this;
    const token = ctx.get('x-token');
    const payload = app.jwt.verify(token, app.config.jwt.secret);
    if (!payload.name) {
      return {
        code: -1,
        message: 'token失效'
      }
    }
    const rule = {
      url: 'string'
    }
    const errors = app.validator.validate(rule, ctx.request.body);
    if (errors) {
      return ctx.helper.lackData(errors);
    }
    const { url } = ctx.request.body;
    const data = await service.other.deleteUrl(url);
    if (data) {
      ctx.helper.successRes(data)
    } else {
      ctx.helper.mysqlError();
    }
  }
}

module.exports = OtherController;