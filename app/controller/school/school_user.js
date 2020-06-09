/**
 * 用户信息
 **/
const Controller = require('egg').Controller;
const {miniproject} = require("../../../config.json");
const iconv = require('iconv-lite');

class SchoolUserController extends Controller {
  // 新建用户
  async create() {
    const { ctx, app, service } = this;
    const rule = {
      name: {
        type: 'nameMax',
        msg: '昵称不能为空！',
      },
      avatar: {
        type: 'string',
        msg: '头像不能为空！'
      },
      JSCODE: {
        type: 'string',
        msg: 'code不能为空！'
      }
    }
    const reqData = ctx.request.body
    const errors = app.validator.validate(rule, reqData)
    if (errors) {
      return ctx.helper.lackData(errors, rule)
    }
    const stockRes = await ctx.curl(`https://api.weixin.qq.com/sns/jscode2session?appid=${miniproject.APPID}&secret=${miniproject.SECRET}&js_code=${reqData.JSCODE}&grant_type=authorization_code`);
    let stockData = iconv.decode(stockRes.data, 'GBK');
    stockData = JSON.parse(stockData)
    if (!(stockData && stockData.openid)) {
      return ctx.helper.lackData([{message: 'OPENID获取失败'}])
    }
    reqData.openid = stockData.openid;
    const data = await service.school.schoolUser.create(reqData)
    if (data) {
      ctx.helper.successRes(data)
    } else {
      ctx.helper.mysqlError();
    }
  }

  // 用户信息修改
  async update() {
    const { ctx, app, service } = this;
    const rule = {
      name: {
        type: 'nameMax',
        msg: '昵称不能为空！',
      },
      userId: {
        type: 'string',
        msg: '用户ID标识不能为空！'
      }
    }
    const reqData = ctx.request.body
    const errors = app.validator.validate(rule, reqData)
    if (errors) {
      return ctx.helper.lackData(errors, rule)
    }
    const data = await service.school.schoolUser.update(reqData)
    if (data) {
      ctx.helper.successRes(data)
    } else {
      ctx.helper.mysqlError();
    }
  }

  // 获取学校省级
  async province() {
    const { ctx, app, service } = this;
    const data = await service.school.schoolUser.province()
    if (data) {
      ctx.helper.successRes(data)
    } else {
      ctx.helper.mysqlError();
    }
  }

  // 获取学校城市
  async city() {
    const { ctx, app, service } = this;
    const rule = {
      province: {
        type: 'string',
        msg: '省份不能为空！'
      }
    }
    const reqData = ctx.request.body
    const errors = app.validator.validate(rule, reqData)
    if (errors) {
      return ctx.helper.lackData(errors, rule)
    }
    const data = await service.school.schoolUser.city(reqData)
    if (data) {
      ctx.helper.successRes(data)
    } else {
      ctx.helper.mysqlError();
    }
  }

  // 获取学校
  async school() {
    const { ctx, app, service } = this;
    const rule = {
      province: {
        type: 'string',
        msg: '省份不能为空！'
      },
      city: {
        type: 'string',
        msg: '城市不能为空！'
      }
    }
    const reqData = ctx.request.body
    const errors = app.validator.validate(rule, reqData)
    if (errors) {
      return ctx.helper.lackData(errors, rule)
    }
    const data = await service.school.schoolUser.school(reqData)
    if (data) {
      ctx.helper.successRes(data)
    } else {
      ctx.helper.mysqlError();
    }
  }
}

module.exports = SchoolUserController;
