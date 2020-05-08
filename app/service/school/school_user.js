const Service = require('egg').Service;

class SchoolUserService extends Service {
  // 新建用户
  async create(reqData) {
    const { name, avatar, des, schoolId, gender, openid } = reqData;
    const school = this.app.mysql.get('school');
    const sql = `INSERT INTO user (name,avatar,openid${des ? ',des' : ''}${schoolId ? ',school_id' : ''}${gender ? ',gender' : ''}) SELECT 
     ?,?,?${des ? ',' + des : ''}${schoolId ? ',' + schoolId : ''}${gender ? ',' + gender : ''} FROM dual WHERE not exists (SELECT id FROM user WHERE openid = ?)`;
    const resSql = await school.query(sql, [name, avatar, openid, openid]);
    if (resSql) {
      return {
        code: 1,
        message: '新增成功'
      }
    } else {
      return false
    }
  }

  // 用户信息修改
  async update(reqData) {
    const { name, avatar, des, schoolId, gender, userId } = reqData;
    const blog = this.app.mysql.get('school');
    const sql = `UPDATE user SET name=?, avatar=?${des ? ',des=' + des : ''}${schoolId ? ',school_id=' + schoolId : ''}${gender ? ',gender=' + gender : ''} WHERE id=?`;
    const resSql = await blog.query(sql, [name, avatar, userId]);
    if (resSql) {
      return {
        code: 1,
        message: '修改成功'
      }
    } else {
      return false
    }
  }

  // 获取学校省级
  async province() {
    const school = this.app.mysql.get('school');
    const sql = `SELECT school_department as province FROM school GROUP BY school_department`;
    const resSql = await school.query(sql);
    if (resSql) {
      return {
        code: 1,
        data: resSql,
        message: '获取成功'
      }
    } else {
      return false
    }
  }

  // 获取学校城市
  async city(reqData) {
    const { province } = reqData;
    const school = this.app.mysql.get('school');
    const sql = `SELECT school_address as city FROM school WHERE school_department = ? GROUP BY school_address`;
    const resSql = await school.query(sql, [province]);
    if (resSql) {
      return {
        code: 1,
        data: resSql,
        message: '获取成功'
      }
    } else {
      return false
    }
  }

  // 获取学校
  async school(reqData) {
    const { province, city } = reqData;
    const school = this.app.mysql.get('school');
    const sql = `SELECT id,school_name as schoolName FROM school WHERE school_department = ? AND school_address = ?`;
    const resSql = await school.query(sql, [province, city]);
    if (resSql) {
      return {
        code: 1,
        data: resSql,
        message: '获取成功'
      }
    } else {
      return false
    }
  }
}

module.exports = SchoolUserService;
