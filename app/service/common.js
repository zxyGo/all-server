const Service = require('egg').Service;

class CommonService extends Service {
  async github(code) {

  }

  async githubToken(code) {
    const { ctx } = this;
    // const tokenResponse = await ctx.curl('https://github.com/login/oauth/access_token', )
  }
}

module.exports = CommonService;