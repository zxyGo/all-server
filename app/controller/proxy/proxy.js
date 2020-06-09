/**
 * vpn相关
 */
const Controller = require('egg').Controller;

class ProxyController extends Controller {
  async subscribe() {
    const { ctx, service, app } = this;
    const data = await service.proxy.proxy.subscribe()
    let _tem = '', _base64Str = '';
    if (data) {
      _tem = data.reduce((acc, cur) => {
        acc.push(cur.address);
        return acc;
      }, []).join('\n')
      _base64Str = (new Buffer(_tem)).toString('base64');
    }
    return ctx.body = _base64Str;
  }
}


module.exports = ProxyController;
