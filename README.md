# all-server
我的所有服务的集合

**config.json数据一些隐私信息，替换成自己的配置**

### 项目结构
```
all-server
|- app
|   |- controller // controller层 解析用户的输入，处理后返回相应的结果
|   |- router // 路由配置
|   |- public // 静态资源（Egg 内置了 static 插件，线上环境建议部署到 CDN，无需该插件）
|   |- view // 模版文件
|   |- service // 业务逻辑层
|   |- middleware // 中间件
|   |- extend // 框架的扩展
|   |- schedule // 定时任务
|
|- config // 配置文件
|   |- config.default.js // 基础配置
|   |- plugin.js // 插件配置
|
|- test // 单元测试
|- app.js // 自定义启动时的初始化工作
```
### 问题集合
* 防止sql注入在使用query执行sql语句时，使用**mysql.escape**方法
```javascript
const postId = 1;
const results = await this.app.mysql.query('update posts set hits = (hits + ?) where id = ?', [1, postId]);

=> update posts set hits = (hits + 1) where id = 1;
```

* axios跨域访问eggjs，使用egg-cors
egg-cors的官方配置
```javascript
// {app_root}/config/config.default.js
exports.cors = {
  // {string|Function} origin: '*',
  // {string|Array} allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
};
```
但是让axios自动发送服务器的cookie，需要设置axios中withCredentials:true。这个时候egg-cors配置中origin就不能配置为'*'，否则会冲突，应该配置成前端地址（比如我的设置成http://localhost:8080），allowMethods根据需要配置，仅仅这样还不行！！！
这里egg-cors的配置还:
必须加上credentials:true

* vue请求post数据提示 missing csrf token

  前后端分离的项目，vue直接给服务器post数据 ，没法获取csrf，官方给的例子是服务器直接渲染的，然后ajax请求携带csrf。

  不知道前后端分离的项目中有没有更好的方案。

  现在后端用了 egg-cors  以及配置api接口不开启csrf验证


### 部署
安装 egg-scripts 到dependencies
```
npm i egg-scripts --save
```
添加 npm scripts 到 package.json
```json
{
  "scripts": {
    "start": "egg-scripts start --daemon",
    "stop": "egg-scripts stop"
  }
}
```
这样我们就可以通过 npm start 和 npm stop 命令启动或停止应用。

### 爬虫
使用 puppeteer 抓取小说

基本使用可以关注 [puppeteer - github](https://github.com/GoogleChrome/puppeteer)


### 添加 github 第三方鉴权登录

### npm install egg-jwt --save 用户认证