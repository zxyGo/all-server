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
    const data = await service.blog.blog.list(pageSize, Number(itemSize));
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
    const data = await service.blog.blog.detail(blogId);
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
    const data = await service.blog.blog.tags();
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
    const data = await service.blog.blog.searchBlog(keyword);
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
    const data = await service.blog.blog.tagOne(pageSize, Number(itemSize), tag)
    if (data) {
      ctx.helper.successRes({
        code: 0,
        ...data
      })
    }
  }

  // 添加博客
  async addBLog() {
    const { ctx, app, service } = this;
    const rule = {
      title: 'string',
      content: 'string',
      description: 'string',
      date: 'string',
      tags: 'string'
    }
    const reqData = ctx.request.body
    const errors = app.validator.validate(rule, reqData)
    if (errors) {
      return ctx.helper.lackData(errors)
    }
    const data = await service.blog.blog.addBlog(reqData)
    if (data) {
      ctx.helper.successRes(data)
    } else {
      ctx.helper.mysqlError();
    }
  }

  /**
   * 更新博客
   */
  async updateBlog() {
    const { ctx, app, service } = this;
    const rule = {
      blogId: 'string',
      title: 'string',
      content: 'string',
      description: 'string',
      date: 'string',
      tags: 'string'
    }
    const reqData = ctx.request.body
    const errors = app.validator.validate(rule, reqData)
    if (errors) {
      return ctx.helper.lackData(errors)
    }
    const data = await service.blog.blog.updateBlog(reqData)
    if (data) {
      ctx.helper.successRes(data)
    } else {
      ctx.helper.mysqlError();
    }
  }

  /**
   * 删除博客
   */
  async deleteBlog() {
    const { ctx, app, service } = this;
    const rule = {
      blogId: 'string'
    }
    const reqData = ctx.request.body
    const errors = app.validator.validate(rule, reqData)
    if (errors) {
      return ctx.helper.lackData(errors)
    }
    const data = await service.blog.blog.deleteBlog(reqData)
    if (data) {
      ctx.helper.successRes(data)
    } else {
      ctx.helper.mysqlError();
    }
  }
}

module.exports = BlogController;
