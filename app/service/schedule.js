/**
 * 定时任务
 */
const Service = require('egg').Service;

class ScheduleList extends Service {
  async shadowsock() {
    const { ctx, service } = this;
    const shadow = this.app.mysql.get('shadowsocks');
    const sql = 'SELECT * FROM user';
    let userList = await shadow.query(sql);
    userList.forEach(async item => {
      if (item.out_of_time < new Date()) {
        await service.tool.sendMail('775703268@qq.com', 'VPN服务到期', `${item.name}，付款日期${ctx.helper.Format(item.pay_time, 'yyyy-MM-dd')}，到期时间${ctx.helper.Format(item.out_of_time, 'yyyy-MM-dd')}`, null);
      }
    });
  }
}

module.exports = ScheduleList;