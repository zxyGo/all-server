/**
 * 配置
 * 应用、插件、框架的配置
 */
const {mysql, gitHub, jwt} = require("../config.json");

module.exports = appInfo => {
  const config = {};

  config.keys = 'dfaklka';

  // mysql的配置
  config.mysql =
  {
    // 单数据库信息配置
    clients: {
      novel: {
        host: mysql.host,
        port: mysql.port,
        user: mysql.user,
        password: mysql.password,
        database: 'novel'
      },
      blog: {
        host: mysql.host,
        port: mysql.port,
        user: mysql.user,
        password: mysql.password,
        database: 'zxy_blog'
      },
      movie: {
        host: mysql.host,
        port: mysql.port,
        user: mysql.user,
        password: mysql.password,
        database: 'movie'
      },
      shadowsocks: {
        host: mysql.host,
        port: mysql.port,
        user: mysql.user,
        password: mysql.password,
        database: 'shadowscoks'
      },
      other: {
        host: mysql.host,
        port: mysql.port,
        user: mysql.user,
        password: mysql.password,
        database: 'other'
      },
      stock: {
        host: mysql.host,
        port: mysql.port,
        user: mysql.user,
        password: mysql.password,
        database: 'stock'
      },
      school: {
        host: mysql.host,
        port: mysql.port,
        user: mysql.user,
        password: mysql.password,
        database: 'school_gold'
      }
    }
  }

  // 参数校验的配置
  config.validate = {
    convert: true,
    widelyUndefined: true,
  };

  // 设置api接口不开启csrf验证
  config.security = {
    csrf: {
      ignore: '/api/*/*'
    },
    domainWhiteList: ['https://funi.funi8.com', 'http://localhost:3000', 'https://blog.zxylucky.com', 'https://backstage.zxylucky.com', 'https://www.funi8.com', 'https://www.zxylucky.com']
  }

  // 设置跨域，并设置白名单
  config.cors = {
    // origin: 'http://localhost:3000',
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  // github 第三方登录
  config.passportGithub = {
    key: gitHub.clientID,
    secret: gitHub.clientSecret,
    callbackURL: 'http://127.0.0.1:7001/api/common/github'
  }

  // 登录认证
  config.jwt = {
    secret: jwt.secret
  }

  config.proxy = true;


  return config;
}

// 启动配置项
exports.cluster = {
  listen: {
    port: 7001,
    hostname: '127.0.0.1',
    // path: '/var/run/egg.sock',
  }
}
