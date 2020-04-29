const Service = require('egg').Service;

class VpnService extends Service {
  // vpn用户列表
  async list(pageSize, itemSize) {
    const vpn = this.app.mysql.get('shadowsocks');
    const sql = 'SELECT id,name,DATE_FORMAT(pay_time,"%Y-%m-%d") as payTime,DATE_FORMAT(out_of_time,"%Y-%m-%d") as outOfTime,status FROM user limit ?,?';
    const countSql = 'SELECT COUNT(*) FROM user';
    let data = await vpn.query(sql, [(pageSize-1)*itemSize, itemSize]);
    let count = await vpn.query(countSql);
    return {
      list: data,
      count: count[0]['COUNT(*)']
    }
  }

  // vpn用户添加
  async add(reqData) {
    const { name, payTime, outOfTime } = reqData;
    const vpn = this.app.mysql.get('shadowsocks');
    const sql = 'INSERT INTO user (name,pay_time,out_of_time) select ?,?,? from dual where not exists (select id from user where name = ?)';
    const resSql = await vpn.query(sql, [name, payTime, outOfTime, name]);
    if (resSql) {
      return {
        code: 1,
        message: '添加成功'
      }
    } else {
      return false
    }
  }

  // vpn用户修改
  async update(reqData) {
    const { id, payTime, outOfTime, status } = reqData;
    const vpn = this.app.mysql.get('shadowsocks');
    const sql = 'UPDATE user set pay_time=?,out_of_time=?,status=? WHERE id=?';
    const resSql = await vpn.query(sql, [payTime, outOfTime, status, id]);
    if (resSql) {
      return {
        code: 1,
        message: '修改成功'
      }
    } else {
      return false
    }
  }

  // vpn用户删除
  async delete(reqData) {
    const { id } = reqData;
    const vpn = this.app.mysql.get('shadowsocks');
    const sql = 'DELETE FROM user WHERE id = ?';
    const resSql = await vpn.query(sql, [id]);
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

module.exports = VpnService;