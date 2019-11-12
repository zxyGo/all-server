// 小说相关
const Controller = require('egg').Controller;

class NovelController extends Controller {
  async list() {
    const { ctx, service } = this;
    const data = await service.novel.list()
    if (data) {
      ctx.helper.successRes({
        code: 0,
        list: data
      })
    }
  }

  async chapterList() {
    const { app, ctx, service } = this;
    const rule = {
      novelId: 'string'
    }
    const errors = app.validator.validate(rule, ctx.query);
    if (errors) {
      return ctx.helper.lackData(errors);
    }
    const novelId = ctx.query.novelId;
    const data = await service.novel.chapterList(novelId);
    if (data) {
      ctx.helper.successRes({
        code: 0,
        list: data
      });
    }
  }

  async content() {
    const { app, ctx, service } = this;
    const rule = {
      novelId: 'string',
      chapterId: 'string'
    }
    const errors = app.validator.validate(rule, ctx.query);
    if (errors) {
      return ctx.helper.lackData(errors);
    }
    const { novelId, chapterId, nextPage = 0 } = ctx.query;
    const data = await service.novel.content(novelId, chapterId, nextPage);
    if (data) {
      ctx.helper.successRes({
        code: 0,
        content: data
      })
    } else {
      ctx.helper.successRes({
        code: 1,
        message: '没有更多了'
      });
    }
  }

  async saveIp() {
    const { ctx, service } = this;
    const clientIp = ctx.ips.length > 0 ? ctx.ips[ctx.ips.length - 1] : ctx.ip;
    const data = await service.novel.saveIp(clientIp);
    if (data) {
      ctx.helper.successRes({
        code: 0,
        message: 'success'
      });
    } else {
      ctx.helper.mysqlError();
    }
  }

  async needNovel() {
    const { app, ctx, service } = this;
    const clientIp = ctx.ips.length > 0 ? ctx.ips[ctx.ips.length - 1] : ctx.ip;
    const rule = {
      novelName: 'string'
    }
    // 验证参数
    const errors = app.validator.validate(rule, ctx.request.body);
    if (errors) {
      return ctx.helper.lackData(errors);
    }
    const { novelName } = ctx.request.body;
    service.tool.sendMail('775703268@qq.com', '需要添加的小说', novelName, null);
    const data = await service.novel.needNovel(novelName, clientIp);
    if (data) {
      ctx.helper.successRes({
        code: 0,
        message: 'success'
      });
    } else {
      ctx.helper.mysqlError();
    }
  }

  async isValid() {
    const { ctx, service } = this;
    const user = ctx.session.name;
    if (!user) {
      ctx.helper.successRes({
        code: -1,
        message: 'success'
      });
    }
  }

  // 添加小说
  async add_novel() {
    const { ctx, app, service } = this;
    const rule = {
      novelName: 'string',
      novelId: 'string',
      novelUrl: 'string'
    }
    const errors = app.validator.validate(rule, ctx.request.body);
    if (errors) {
      return ctx.helper.lackData(errors);
    }
    const { novelName, novelId, novelUrl, queryEle = '' } = ctx.request.body;
    service.novel.add_novel(novelName, novelId, novelUrl, queryEle);
    ctx.header.successRes({
      code: 0,
      message: '添加中，等待抓取。。。'
    })
  }

  // 测试
  async testNovel() {
    const { service } = this;
    service.novel.getUrlInfo('https://www.biqudu.net/31_31729/2212637.html');
  }
}

module.exports = NovelController;