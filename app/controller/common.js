/**
 * 公用接口
 **/ 
const Controller = require('egg').Controller;

class CommonController extends Controller {
  // github授权回调
  async github() {
    const { ctx, service, app } = this;
    const rule = {
      code: 'string'
    }
    const errors = app.validator.validate(rule, ctx.query);
    if (errors) {
      return ctx.helper.lackData(errors);
    }
    const { code } = ctx.query;
    const data = await service.common.github(code);
  }
}

module.exports = CommonController;