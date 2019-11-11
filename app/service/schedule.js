/**
 * 定时任务
 */
const Service = require('egg').Service;

const puppeteer = require('puppeteer');

class ScheduleList extends Service {
  async shadowsock() {
    const { ctx, service } = this;
    const shadow = this.app.mysql.get('shadowsocks');
    const sql = 'SELECT * FROM user';
    let userList = await shadow.query(sql);
    userList.forEach(async item => {
      if (item.out_of_time < new Date() && item.status != 0) {
        await service.tool.sendMail('775703268@qq.com', 'VPN服务到期', `${item.name}，付款日期${ctx.helper.Format(item.pay_time, 'yyyy-MM-dd')}，到期时间${ctx.helper.Format(item.out_of_time, 'yyyy-MM-dd')}`, null);
      }
    });

    // 记录定时任务的时间，是否运行
    const other = this.app.mysql.get('other');
    const recodeSql = 'replace into schedule_recode (name, time) values (?, ?)';
    other.query(recodeSql, ['vpn到期时间', ctx.helper.Format(new Date(), 'yyyy-MM-dd')]);
  }

  /**
   * 获取代理
   * @param url 
   */
  async getProxy(url) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox']
    });

    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    // 有些网站需要设置UA，默认的UA是：
    page.setUserAgent("Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36");

    try {
      await page.goto(url, {
        headless: false,
        waitUntil: 'networkidle2',
        ignoredHTTPSErrors: true,
        timeout: 60000
      })
    } catch (err) {
      await browser.close();
      return false;
    }
    await page.$$eval('tr ')
  }

  // 
}

module.exports = ScheduleList;