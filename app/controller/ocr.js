/**
 * OCR
 */
const Controller = require('egg').Controller;

class OcrController extends Controller{
  /**
   * 身份证识别
   */
  async IdCard() {
    const { ctx, app, service } = this;
    console.log(ctx.request.body)
  }
}

module.exports = OcrController;
