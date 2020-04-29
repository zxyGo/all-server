const Service = require('egg').Service;

class BlogService extends Service {
  async list(pageSize, itemSize) {
    const blog = this.app.mysql.get('blog');
    const sql = 'SELECT id,tags,description,title,date,clickNum,likeNum,commentNum FROM blogs order by date desc limit ?,?';
    const countSql = 'SELECT COUNT(*) FROM blogs';
    let data = await blog.query(sql, [(pageSize-1)*itemSize, itemSize]);
    let count = await blog.query(countSql);
    return {
      list: data,
      count: count[0]['COUNT(*)']
    }
  }

  async detail(blogId) {
    const blog = this.app.mysql.get('blog');
    const blogSql = 'SELECT * FROM blogs WHERE id=?';
    // 浏览数统计
    const blogViewSql = 'update blogs set clickNum=(clickNum+1) where id=?'
    const blogInfo = await blog.query(blogSql, [blogId]);
    await blog.query(blogViewSql, [blogId]);
    return {
      blogInfo: blogInfo[0]
    }
  }

  async tags() {
    const blog = this.app.mysql.get('blog');
    const sql = 'SELECT tags as tag,count(*) as blogCount FROM blogs group by tags';
    const data = await blog.query(sql);
    return data
  }

  async searchBlog(keyword) {
    const blog = this.app.mysql.get('blog');
    const sql = 'SELECT id,tags,description,title,date,clickNum,likeNum,commentNum FROM blogs WHERE content LIKE ? OR title LIKE ?';
    const data = await blog.query(sql, [`%${keyword}%`, `%${keyword}%`]);
    return data
  }

  async tagOne(pageSize, itemSize, tag) {
    const blog = this.app.mysql.get('blog');
    const sql = 'SELECT id,tags,description,title,date,clickNum,likeNum,commentNum FROM blogs where tags like ? order by date desc limit ?,?';
    const countSql = 'SELECT COUNT(*) FROM blogs where tags like ?';
    let data = await blog.query(sql, [`%${tag}%`, (pageSize-1)*itemSize, itemSize]);
    let count = await blog.query(countSql, [`%${tag}%`]);
    return {
      list: data,
      count: count[0]['COUNT(*)']
    }
  }

  async addBlog(reqData) {
    const { title, content, description, date, tags } = reqData;
    const blog = this.app.mysql.get('blog');
    const sql = 'insert into blogs (title, content, description, date, tags) select ?,?,?,?,? from dual where not exists (select id from blogs where title = ?)';
    const resSql = await blog.query(sql, [title, content, description, Date.parse(date), tags, title]);
    if (resSql) {
      return {
        code: 1,
        message: '添加成功'
      }
    } else {
      return false
    }
  }

  async updateBlog(reqData) {
    const { blogId, title, content, description, date, tags } = reqData;
    const blog = this.app.mysql.get('blog');
    const sql = 'UPDATE blogs SET title=?, content=?, description=?, date=?, tags=? WHERE id=?';
    const resSql = await blog.query(sql, [title, content, description, Date.parse(date), tags, blogId]);
    if (resSql) {
      return {
        code: 1,
        message: '修改成功'
      }
    } else {
      return false
    }
  }

  async deleteBlog(reqData) {
    const { blogId } = reqData;
    const blog = this.app.mysql.get('blog');
    const sql = 'DELETE FROM blogs WHERE id=?';
    const resSql = await blog.query(sql, [blogId])
    if (resSql) {
      return {
        code: 1,
        message: '删除成功'
      }
    } else {
      return false
    }
  }
}

module.exports = BlogService;
