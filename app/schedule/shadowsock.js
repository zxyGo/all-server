const Subscription = require('egg').Subscription;

class shadowsock extends Subscription {
// 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      // interval: '1m', // 1 分钟间隔
      // type: 'all', // 指定所有的 worker 都需要执行
      cron: '0 0 0 * * *', // 规定时间 每天00:00:00
      type: 'all'
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { service } = this;
    await service.schedule.shadowsock();
  }
}

module.exports = shadowsock;