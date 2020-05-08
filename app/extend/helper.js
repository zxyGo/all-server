/**
 * 编写扩展
 */

/**
 * 统一http返回
 */
module.exports = {
  // 缺少参数
  lackData(errors, rule) {
    this.ctx.status = 400; // 缺少参数状态码
    const responseData = {
      code: -1,
      data: errors,
    }
    if (rule && errors && errors[0].message === 'required') {
      responseData.msg = rule[errors[0].field].msg
    } else if (errors && errors[0]) {
      responseData.msg = errors[0].message
    }
    this.ctx.body = responseData
  },
  // 成功返回
  successRes(sendData) {
    this.ctx.status = 200;
    this.ctx.body = sendData;
  },
  // 数据库连接失败
  mysqlError() {
    ctx.status = 500;
    this.ctx.body = {
      code: -1,
      message: '数据库连接失败'
    }
  },
  trim(str) {
    return str.replace(/纯文字在线阅读本站域名<b class="red">www.xklxsw.com<\/b> 手机同步阅读请访问 <b class="red">m.xklxsw.com<\/b><br>/g, '').replace(/<p>可乐小说网最快更新，无弹窗阅读请<a class="red" href="javascript:void\(0\)" onclick="addFav\(\)" title="收藏可乐小说网" rel="sidebar">收藏可乐小说网\(www\.xklxsw\.com\)<\/a>。<\/p>/g, '').replace(/㈧.*ＣＯＭ/g, '').replace(/笔趣阁.*最新章节！/g, '').replace(/<script>.*<\/script>/g, '').replace(/<div align="center">.*<\/div>/g, '').replace(/天才.*本站地址.*/, '').replace(/手机版阅读网址.*/, '').trim();
  },
  Format(date, fmt) {
    var o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
      "q+": Math.floor((date.getMonth() + 3) / 3),
      "S": date.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
}
