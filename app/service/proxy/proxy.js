const Service = require('egg').Service;

class ProxyService extends Service {
  async subscribe() {
    const vpn = this.app.mysql.get('shadowsocks');
    const sql = 'SELECT address FROM address'
    const resSql = await vpn.query(sql);
    if (resSql) {
      return resSql
    } else {
      return false
    }
  }
}

module.exports = ProxyService;
