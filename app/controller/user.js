/**
 * 用户
 */
const Controller = require('egg').Controller;

class UserController extends Controller {
  async login() {
    const { app, ctx, service } = this;
    const rule = {
      name: 'string',
      password: 'string'
    };
    // 验证参数
    const errors = app.validator.validate(rule, ctx.request.body);
    if (errors) {
      return ctx.helper.lackData(errors);
    }
    const { name, password } = ctx.request.body;

    const data = await service.user.login(name, password);
    if (data) {
      ctx.helper.successRes(data)
    } else {
      ctx.helper.mysqlError();
    }
  }

  async register() {
    const { app, ctx, service } = this;
    const rule = {
      name: 'string',
      password: 'string'
    };
    // 验证参数
    const errors = app.validator.validate(rule, ctx.request.body);
    if (errors) {
      return ctx.helper.lackData(errors);
    }
    const { name, password } = ctx.request.body;

    const data = await service.user.register(name, password);
    if (data) {
      ctx.helper.successRes(data)
    } else {
      ctx.helper.mysqlError();
    }
  }

  async info() {
    const { app, ctx, service } = this;
    const rule = {
      token: 'string'
    }
    // 验证参数
    const token = ctx.get('x-token');
    const errors = app.validator.validate(rule, {token: token});
    if (errors) {
      return ctx.helper.lackData(errors);
    }
    const data = await service.user.info(token);
    if (data) {
      ctx.helper.successRes(data)
    } else {
      ctx.helper.mysqlError();
    }
  }
}

module.exports = UserController;