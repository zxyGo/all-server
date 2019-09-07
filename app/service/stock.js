const Service = require('egg').Service;
const iconv = require('iconv-lite');

class StockService extends Service {
  async stockRecode() {
    const { ctx, app, service } = this;
    const stock = app.mysql.get('stock');
    const getStockListSql = 'select code, pre_value, content, send_mail, adjust from stock_list';
    const stockList = await stock.query(getStockListSql);
    let sendContent = '';
    for (let i = 0; i < stockList.length; i++) {
      const nowStockData = await this.getStock(stockList[i].code);
      if (stockList[i].adjust == 0 && stockList[i].pre_value <= nowStockData[3] && stockList[i].send_mail != 1) {
        sendContent += stockList[i].content;
      }
      if (stockList[i].adjust == 1 && stockList[i].pre_value >= nowStockData[3] && stockList[i].send_mail != 1) {
        sendContent += stockList[i].content;
      }
    }
    // 发送email
    if (sendContent !== '') {
      await service.tool.sendMail('775703268@qq.com', '股票预期', sendContent, null);
    }
    // 记录运行时间
    const other = app.mysql.get('other');
    const recodeSql = 'replace into schedule_recode (name, time) values (?, ?)';
    other.query(recodeSql, ['股票预期', ctx.helper.Format(new Date(), 'yyyy-MM-dd hh:mm:ss')]);
  }

  // 获取实时股票数据
  async getStock(code) {
    const { ctx } = this;
    const stockRes = await ctx.curl(`http://hq.sinajs.cn/list=${code}`);
    const stockData = iconv.decode(stockRes.data, 'GBK');
    const stockArr = stockData.match(/"([\u4e00-\u9fa5]|[0-9\.,:-])*"/)[0].replace('"', '').split(',');
    return stockArr;
  }

  /**
   * 添加股票
   */
  async add(reqData) {
    const { code, preValue, content, adjust } = reqData;
    const { app } = this;
    const stock = app.mysql.get('stock');
    const sql = 'insert into stock_list (code, pre_value, content, adjust) value (?,?,?,?)';
    const data = await stock.query(sql, [code, preValue, content,adjust]);
    if (data) {
      return {
        code: 1,
        message: '添加成功'
      }
    } else {
      return false
    }
  }

  /**
   * 更新股票信息
   */
  async update(reqData) {
    const { stockId, preValue, content, sendMail = 0, adjust } = reqData;
    const { app } = this;
    const stock = app.mysql.get('stock');
    const sql = 'update stock_list SET pre_value=?,content=?,send_mail=?,adjust=? where id = ?';
    const data = await stock.query(sql, [preValue, content,sendMail, adjust, stockId]);
    if (data) {
      return {
        code: 1,
        message: '修改成功'
      }
    } else {
      return false
    }
  }

  /**
   * 删除股票
   */
  async delete(reqData) {
    const { stockId } = reqData;
    const { app } = this;
    const stock = app.mysql.get('stock');
    const sql = 'delete from stock_list where id = ?';
    const data = await stock.query(sql, [stockId]);
    if (data) {
      return {
        code: 1,
        message: '删除成功'
      }
    } else {
      return false
    }
  }

  /**
   * 获取股票列表
   */
  async list() {
    const { app } = this;
    const stock = app.mysql.get('stock');
    const sql = 'select id as stockId,code,pre_value as preValue,content,send_mail as sendMail,adjust from stock_list';
    const data = await stock.query(sql);
    if (data) {
      return {
        code: 1,
        list: data
      }
    } else {
      return false
    }
  }
}

module.exports = StockService;