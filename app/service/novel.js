const Service = require('egg').Service;

const puppeteer = require('puppeteer');

let proxyIp = '';

class NovelService extends Service {
  async list() {
    const novel = this.app.mysql.get('novel');
    const sqlCondition = 'name, novel_id as novelId, author, image, word_count as wordCount, intro, type';
    const sql = `select ${sqlCondition} from novel_list order by update_time DESC`;
    let data = await novel.query(sql)
    return data
  }

  async chapterList(novelId) {
    const novel = this.app.mysql.get('novel');
    const sqlCondition = 'chapter_name as chapterName, chapter_id as chapterId';
    const sql = `select ${sqlCondition} from novel_chapter where novel_id = ? order by chapter_id DESC`;
    let data = await novel.query(sql, [novelId])
    return data
  }

  async content(novelId, chapterId, nextPage) {
    const novel = this.app.mysql.get('novel');
    const sqlCondition = 'chapter_name as chapterName, chapter_id as chapterId, uncompress(content)';
    let sql = ''
    if (nextPage == 0) {
      sql = `select ${sqlCondition} from novel_chapter where novel_id = ? and chapter_id = ?`;
    } else {
      sql = `select ${sqlCondition} from novel_chapter where novel_id = ? and chapter_id > ? limit 1`
    }
    let data = await novel.query(sql, [novelId, chapterId])
    if (data.length === 0) {
      return false;
    }
    return {
      chapter_id: data[0].chapterId,
      content: data[0]['uncompress(content)'].toString(),
      chapter_name: data[0].chapterName
    }
  }

  // 保存用户ip
  async saveIp(clientIp) {
    const { ctx } = this;
    const novel = this.app.mysql.get('novel');
    const nowDate = ctx.helper.Format(new Date(), 'yyyy-MM-dd hh:mm:ss');
    const sql_1 = 'select id from user_info where ip=?';
    const adjustData = await novel.query(sql_1, [clientIp]);
    if (adjustData.length === 0) {
      const result = await ctx.curl('https://tool.lu/ip/ajax.html', {
        method: 'POST',
        data: {
          ip: clientIp
        },
        dataType: 'json'
      })
      const remark = result.status === 200 && result.data.status ? result.data.text.location : '';
      const sql = 'insert into user_info (ip,novel_list,date,remark) values (?,?,?,?)';
      const data = await novel.query(sql, [clientIp, '', nowDate, remark]);
      if (data) {
        return true;
      } else {
        return false;
      }
    } else {
      const sql = `update user_info set number=number+1,date=? where ip=?`;
      const res = await novel.query(sql, [nowDate, clientIp]);
      if (res) {
        return true;
      } else {
        return false;
      }
    }
  }

  // 用户需要的小说
  async needNovel(novelName, ip) {
    const novel = this.app.mysql.get('novel');
    const sql = `update user_info set novel_list=concat(novel_list,?) where ip=?`;
    const data = await novel.query(sql, [',' + novelName, ip]);
    if (data.affectedRows !== 0) {
      return true;
    } else {
      return false;
    }
  }


  // 添加小说
  async add_novel(novelName, novelId, novelUrl, queryEle) {
    const { service } = this;
    let resBack = false;
    do {
      resBack = await this.getChapter(novelId, novelUrl, queryEle);
    } while (!resBack)
    await service.tool.sleepWait(Math.ceil(Math.random(0, 1) * 30000) + 30000);
    for (let i = 0; i < resBack.length; i++) {
      let contentResBack = false;
      const chapterId = resBack[i].chapterId;
      do {
        contentResBack = await this.getNovelContent(novelId, novelUrl, chapterId);
      } while (!contentResBack);
      if (contentResBack.length > 300) {
        await this.addNovelContent(novelId, resBack[i].chapterName, chapterId,contentResBack);
      }
      await service.tool.sleepWait(Math.ceil(Math.random(0, 1) * 30000) + 30000);
    }
    await service.tool.sendMail('775703268@qq.com', '添加小说成功', `${novelName}抓取完毕`, null);
  }
  // 获取小说所有章节
  async getChapter(novelId, novelUrl, queryEle) {
    const { service } = this;
    if (!proxyIp) {
      proxyIp = await service.proxy.getProxy();
    }
    const browser = await puppeteer.launch({
      args: [`--proxy-server=${proxyIp}`, '--no-sandbox']
    });
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    // 有些网站需要设置UA，默认的UA是：
    page.setUserAgent("Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36");
    try {
      await page.goto(`${novelUrl}/${novelId}/`, {
        headless: false,
        waitUntil: 'networkidle2',
        ignoredHTTPSErrors: true,
        timeout: 60000
      });
    } catch (err) {
      await browser.close();
      await service.proxy.updateProxy(proxyIp, 2);
      proxyIp = '';
      return false;
    }


    let eleQuery = queryEle || '#list'; // 需要查找的元素
    await page.waitForSelector(eleQuery);
    const eles = await page.$$eval(`${eleQuery} dl dd a`, els => {
      //如果需要赋值要返回Promise
      return new Promise(async (resolve) => {
        //...一波骚操作
        //可以用Dom api啦
        let chapterArr = [];
        for (let i = els.length - 1; i >= 0; i--) {
          console.log(els[i])
          let chapterId = '';
          if (els[i].href.indexOf('/') !== -1) {
            chapterId = els[i].href.match(/\/[0-9]+\./)[0].slice(1, -1);
          } else {
            chapterId = els[i].href.match(/\/[0-9]+\./)[0].slice(1, -1);
          }
          let chapterName = els[i].text;
          chapterArr.push({ chapterId: chapterId, chapterName: chapterName })
        }
        resolve(chapterArr)
      })
    })
    await browser.close();
    await service.proxy.updateProxy(proxyIp, 1);
    return eles;
  }

  // 获取小说章节内容
  async getNovelContent(novelId, novelUrl, chapterId) {
    const { service, ctx } = this;
    if (!proxyIp) {
      proxyIp = await service.proxy.getProxy();
    }
    const browser = await puppeteer.launch({
      args: [`--proxy-server=${proxyIp}`, '--no-sandbox']
    });
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    // 有些网站需要设置UA，默认的UA是：
    page.setUserAgent("Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36");
    try {
      await page.goto(`${novelUrl}/${novelId}/${chapterId}.html`, {
        headless: false,
        waitUntil: 'networkidle2',
        ignoredHTTPSErrors: true,
        timeout: 60000
      });
    } catch (err) {
      await browser.close();
      await service.proxy.updateProxy(proxyIp, 2);
      proxyIp = '';
      return false;
    }
    await page.waitForSelector('#content');
    const result = await page.$eval('#content', els => {
      // console.log(el);
      // return el;
      //如果需要赋值要返回Promise
      return new Promise(async (resolve) => {
        //...一波骚操作
        //可以用Dom api啦
        resolve(els.innerHTML)
      })
    });
    await browser.close();
    await service.proxy.updateProxy(proxyIp, 1);
    return ctx.helper.trim(result);
  }

  // 插入小说内容
  async addNovelContent(novelId, chapterName, chapterId, chapterContent) {
    const novel = this.app.mysql.get('novel');
    const sql = 'insert into novel_chapter (novel_id,chapter_name,chapter_id,content) select ?,?,?,COMPRESS(?) from dual where not exists (select novel_id from novel_chapter where chapter_id=? and novel_id = ?)';
    const data = await novel.query(sql, [novelId, chapterName, chapterId, chapterContent, chapterId, novelId]);
    if (data) {
      return true;
    } else {
      return false;
    }
  }

  // 临时存入小说章节信息
  // async saveNovelInfo() {
  //   const novel = this.
  // }


  // ********************************************
  // 请求网站
  async getUrlInfo (url) {
    const {service, ctx} = this;
    if (!proxyIp) {
      proxyIp = await service.proxy.getProxy();
      // 没有可用代理后返回
      if (!proxyIp) {
        return service.tool.sendMail('775703268@qq.com', '添加小说失败', '没有可以使用的代理', null);
      }
    }
    const browser = await puppeteer.launch({
      args: [`--proxy-server=${proxyIp}`, '--no-sandbox']
      // args: ['--no-sandbox']
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
      await service.proxy.updateProxy(proxyIp, 2);
      proxyIp = '';
      this.getUrlInfo(url);
      return false;
    }
   
    // 记录成功的代理
    await service.proxy.updateProxy(proxyIp, 1);

    // 点击下一页
    let isNextPage = true;
    do {
      // 获取章节内容
      const result = await page.$eval('#content', els => {
        // console.log(el);
        // return el;
        //如果需要赋值要返回Promise
        return new Promise(async (resolve) => {
          //...一波骚操作
          //可以用Dom api啦
          resolve(els.innerHTML)
        })
      });
      const novelContent = ctx.helper.trim(result);
      

      // 获取小说ID showpop('/modules/article/addbookcase.php?id=31729&cid=2212637&cname=第一章 蟒雀吞龙&ajax_request=1');
      const novelInfo = await page.$eval('.bookname .bottem1 a:last-child', el => {
        return new Promise(async (resolve) => {
          const infoStr = el.getAttribute('onclick');
          let infoObj;
          if (infoStr) {
            const infoArr = infoStr.match(/\?.*'/)[0].slice(1, -1).split('&');
            infoObj = infoArr.reduce((acc, cur) => {
              const temArr = cur.split('='), temObj = new Object();
              temObj[temArr[0]] = temArr[1];
              Object.assign(acc, temObj);
              return acc;
            }, {})
          }
          resolve(infoObj)
        })
      })
      // 获取信息插入数据库
      if (novelContent.length > 300) {
        this.addNovelContent(novelInfo.id, novelInfo.cname, novelInfo.cid, novelContent);
      console.log(novelInfo.cname)
      }
      // 设置间隔时间，防封IP
      const nextPageTitle = await page.$eval('.bottem2 a.next', el => {
        return new Promise(async (resolve) => {
          resolve(el.href)
        });
      });
      // console.log(/\.html/.test(nextPageTitle));
      // 判断是否是最后一章
      isNextPage = /\.html/.test(nextPageTitle)
      // 是最后一章跳出循环
      if (!isNextPage) break;

      await service.tool.sleepWait(Math.ceil(Math.random(0, 1) * 30000) + 30000);
      const [response] = await Promise.all([
        page.waitForNavigation(),
        page.click('.bottem2 a.next'),
      ]);
      // 获取下一章,正确返回数据_status:200 _statusText:"OK"
      // 错误重新循环，换ip
      if (!response._status || response._status != 200 || response._statusText != 'ok') {
        await browser.close();
        await service.proxy.updateProxy(proxyIp, 2);
        proxyIp = '';
        return this.getUrlInfo(nextPageTitle);
      }
      
    } while (isNextPage)
    await browser.close();
    // 抓取完毕后通知
    await service.tool.sendMail('775703268@qq.com', '添加小说成功', `抓取完毕`, null);
  }
}

module.exports = NovelService;