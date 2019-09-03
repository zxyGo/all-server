const Service = require('egg').Service;

const bcrypt = require('bcryptjs');

class UserService extends Service {
  async login(name, password) {
    const novel = this.app.mysql.get('novel');
    // 判断用户名是否存在
    const isExistSql = 'select password from user where name = ?';
    const isExistSqlRes = await novel.query(isExistSql, [name]);
    if (isExistSqlRes.length == 0) {
      return {
        code: 1,
        message: '用户名不存在'
      }
    } else {
      const hashPassword = isExistSqlRes[0].password;
      const comparePassword =  bcrypt.compareSync(password, hashPassword);
      if (!comparePassword) {
        return {
          code: 1,
          message: '密码不正确'
        }
      } else {
        const userToken = {
          name: name
        };
        const token = this.app.jwt.sign(userToken, this.app.config.jwt.secret,  {expiresIn: 7 * 24 * 60 * 60});
        return {
          code: 1,
          token: token,
          message: '登录成功'
        }
      }
    }
  }

  async register(name, password) {
    const novel = this.app.mysql.get('novel');
    // 判断用户名是否存在
    const isExistSql = 'select count(*) from user where name = ?';
    const isExistSqlRes = await novel.query(isExistSql, [name]);
    console.log(isExistSqlRes[0]['count(*)'])
    if (isExistSqlRes[0]['count(*)'] != 0) {
      return {
        code: 1,
        message: '用户名已存在'
      }
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    const date = this.ctx.helper.Format(new Date, 'yyyy-MM-dd');
    const sql = 'insert into user (name,password,date) values (?,?,?)';
    const sqlRes = await novel.query(sql, [name, hashPassword, date])
    if (sqlRes) {
      const userToken = {
        name: name
      };
      const token = this.app.jwt.sign(userToken, this.app.config.jwt.secret,  {expiresIn: 7 * 24 * 60 * 60});
      return {
        code: 1,
        token: token,
        message: '注册成功'
      }
    } else {
      return false;
    }
  }

  async info(token) {
    const payload = this.app.jwt.verify(token, this.app.config.jwt.secret);
    console.log(payload.name)
    if (payload.name) {
      const novel = this.app.mysql.get('novel');
      const sql = 'select avatar,roles from user where name = ?';
      const sqlRes = await novel.query(sql, [payload.name]);
      if (sqlRes) {
        return {
          code: 1,
          data: {
            name: payload.name,
            avatar: sqlRes[0].avatar,
            roles: sqlRes[0].roles
          }
        }
      } else {
        return false;
      }
    } else {
      return {
        code: 2,
        message: 'token失效'
      }
    }
  }
}

module.exports = UserService;