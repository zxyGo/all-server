const Subscription = require('egg').Subscription;

class stock extends Subscription {
  static get schedule() {
    return {
      cron: '0 */3 9,10,13,14 * * 1,2,3,4,5',
      type: 'all'
    }
  }

  async subscribe() {
    const { service } = this;
    await service.other.stock.stockRecode();
  }
}

module.exports = stock;
