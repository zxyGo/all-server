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
    const blogInfo = await blog.query(blogSql, [blogId]);
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
}

module.exports = BlogService;