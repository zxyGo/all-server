/**
 * vpn相关
 */
const Controller = require('egg').Controller;

class VpnController extends Controller {
  // vpn用户列表
  async list() {
    const { ctx, service, app } = this;
    const rule = {
      pageSize: 'number'
    }
    const errors = app.validator.validate(rule, ctx.query);
    if (errors) {
      return ctx.helper.lackData(errors);
    }
    const { pageSize, itemSize = 20 } = ctx.query;
    const data = await service.other.vpn.list(pageSize, Number(itemSize));
    if (data) {
      ctx.helper.successRes({
        ...data,
        code: 1
      })
    }
  }

  // vpn用户添加
  async add() {
    const { ctx, service, app } = this;
    const rule = {
      name: 'string',
      payTime: 'string',
      outOfTime: 'string'
    }
    const reqData = ctx.request.body
    const errors = app.validator.validate(rule, reqData)
    if (errors) {
      return ctx.helper.lackData(errors)
    }
    const data = await service.other.vpn.add(reqData)
    if (data) {
      ctx.helper.successRes(data)
    } else {
      ctx.helper.mysqlError();
    }
  }

  // vpn用户修改
  async update() {
    const { ctx, service, app } = this;
    const rule = {
      id: 'string',
      payTime: 'string',
      outOfTime: 'string',
      status: 'string'
    }
    const reqData = ctx.request.body
    const errors = app.validator.validate(rule, reqData)
    if (errors) {
      return ctx.helper.lackData(errors)
    }
    const data = await service.other.vpn.update(reqData)
    if (data) {
      ctx.helper.successRes(data)
    } else {
      ctx.helper.mysqlError();
    }
  }

  // vpn用户删除
  async delete() {
    const { ctx, service, app } = this;
    const rule = {
      id: 'string'
    }
    const reqData = ctx.request.body
    const errors = app.validator.validate(rule, reqData)
    if (errors) {
      return ctx.helper.lackData(errors)
    }
    const data = await service.other.vpn.delete(reqData)
    if (data) {
      ctx.helper.successRes(data)
    } else {
      ctx.helper.mysqlError();
    }
  }
}


module.exports = VpnController;
