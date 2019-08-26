// 插件配置 开启插件
exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks'
}

// mysql插件开启
exports.mysql = {
  enable: true,
  package: 'egg-mysql'
}

// 参数校验
exports.validate = {
  enable: true,
  package: 'egg-validate'
}

// 路由映射太多，进行拆分
exports.routerPlus = {
  enable: true,
  package: 'egg-router-plus'
}

// 跨域插件
exports.cors = {
  enable: true,
  package: 'egg-cors'
}

// github 鉴权

exports.passport = {
  enable: true,
  package: 'egg-passport'
}

exports.passportGithub = {
  enable: true,
  package: 'egg-passport-github',
}

// 登录信息认证插件
exports.jwt = {
  enable: true,
  package: "egg-jwt"
}