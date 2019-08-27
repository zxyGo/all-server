const Service = require('egg').Service;

class OtherService extends Service {
  async addUrl(url) {
    const other = this.app.mysql.get('other');
    const sql = 'insert into apis (url) select ? from dual where not exists (select id from apis where url = ?)';
    const sqlRes = await other.query(sql, [url, url]);
    if (sqlRes) {
      return {
        code: 1,
        message: '添加成功'
      }
    } else {
      return false
    }
  }

  async urlList() {
    const other = this.app.mysql.get('other');
    const sql = 'select url from apis';
    const sqlRes = await other.query(sql);
    if (sqlRes) {
      return {
        code: 1,
        data: {
          items: sqlRes,
          total: sqlRes.length
        }
      }
    } else {
      return false
    }
  }

  async deleteUrl(url) {
    const other = this.app.mysql.get('other');
    const sql = 'delete from apis where url = ?';
    const sqlRes = await other.query(sql, [url]);
    if (sqlRes) {
      return {
        code: 1,
        message: '删除成功'
      }
    } else {
      return false
    }
  }
}

module.exports = OtherService;