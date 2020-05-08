const path = require('path');

module.exports = app => {
  // app.validator.addRule('jsonString', (_rule, value) => {
  //   try {
  //     JSON.parse(value);
  //   } catch (err) {
  //     return 'must be json string';
  //   }
  // });
  const directory = path.join(app.config.baseDir, 'app/extend');
  app.loader.loadToApp(directory, 'validate');
};
