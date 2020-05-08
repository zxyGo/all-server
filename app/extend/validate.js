module.exports = app =>{
  let { validator } = app;

  // 必填
  validator.addRule('nameMax', (rule, value)=>{
    if (value.length > 10) {
      return '昵称不能大于10个字符！'
    }
  });
}
