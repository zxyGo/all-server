/**
 * 博客相关
 **/ 
const Controller = require('egg').Controller;

class BlogController extends Controller {
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
    const data = await service.blog.list(pageSize, Number(itemSize));
    if (data) {
      ctx.helper.successRes({
        ...data,
        code: 0
      })
    }
  }

  // 获取博客详情
  async detail() {
    const { ctx, service, app } = this;
    const rule = {
      blogId: 'number'
    }
    const errors = app.validator.validate(rule, ctx.query);
    if (errors) {
      return ctx.helper.lackData(errors);
    }
    const { blogId } = ctx.query;
    const data = await service.blog.detail(blogId);
    if (data) {
      ctx.helper.successRes({
        ...data,
        code: 0
      })
    }
  }

  
  // 获取博客tags
  async tags() {
    const { ctx, service } = this;
    const data = await service.blog.tags();
    if (data) {
      ctx.helper.successRes({
        code: 0,
        tags: data
      })
    }
  }

  // 模糊搜索博客
  async searchBlog() {
    const { ctx, app, service } = this;
    const rule = {
      keyword: 'string'
    }
    const errors = app.validator.validate(rule, ctx.query);
    if (errors) {
      return ctx.helper.lackData(errors);
    }
    const { keyword } = ctx.query;
    const data = await service.blog.searchBlog(keyword);
    if (data) {
      ctx.helper.successRes({
        code: 0,
        list: data
      })
    }
  }

  // 根据标签查找内容
  async tagOne() {
    const { ctx, app, service } = this;
    const rule = {
      pageSize: 'number',
      tag: 'string'
    };
    const errors = app.validator.validate(rule, ctx.query);
    if (errors) {
      return ctx.helper.lackData(errors);
    }
    const { pageSize, itemSize = 20,tag } = ctx.query;
    const data = await service.blog.tagOne(pageSize, Number(itemSize), tag)
    if (data) {
      ctx.helper.successRes({
        code: 0,
        ...data
      })
    }
  }
}

module.exports = BlogController;