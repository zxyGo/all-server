const Service = require('egg').Service;

class ProxyService extends Service {
  async getProxy() {
    const proxy = this.app.mysql.get('movie');
    const sql = 'select proxy from proxy_ip where status < 2 limit 1';
    let data = await proxy.query(sql);
    if (data.length !== 0) {
      return data[0].proxy;
    } else {
      return null;
    }
  }

  /**
   * 更新代理是否成功
   * @param type 1-成功/2-失败
   **/
  async updateProxy(proxy, type) {
    const proxyPoll = this.app.mysql.get('movie');
    let data;
    if (type === 1) {
      const successSql = 'update proxy_ip set success = 1 where proxy = ?';
      data = await proxyPoll.query(successSql, [proxy]);
    } else {
      const failSql = 'update proxy_ip set status = status+1 where proxy = ?';
      data = await proxyPoll.query(failSql, [proxy]);
    }
    if (data.affectedRows !== 0) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = ProxyService;