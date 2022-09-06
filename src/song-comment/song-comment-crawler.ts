import { Injectable } from "@nestjs/common";
import { FrontEndSongMeta } from "./types/song-meta";
import puppeteer, { Page, PageEmittedEvents } from "puppeteer";
import { GeniusLyricInfoProxy } from "./genius-lyric-info-proxy";


// 核心类：使用这个类爬取歌曲 comment
@Injectable()
export class SongCommentCrawler {

  constructor(
    private readonly geniusLyricInfoProxy: GeniusLyricInfoProxy,
  ) {}

  async getCommentList(frontEndSongMeta: FrontEndSongMeta, externalId: string){
    await this.getGeniusCommentListForTest(frontEndSongMeta)
    this.getYTBCommentList(externalId)
  }

  async getGeniusCommentList(frontEndSongMeta: FrontEndSongMeta){
    try{
      // 使用 puppeteer 库的无头浏览器打开 `https://genius.com/search?q=${spotifyalbum}` 专辑查找结果页面
      const geniusSearchUrl = `https://genius.com/search?q=${frontEndSongMeta.spotifyAlbum}`
      const browser = await puppeteer.launch({
        headless: false,   //有浏览器界面启动
      });
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
      await page.goto(geniusSearchUrl, {
        timeout: 1000000,
      });

      // 在上一步的页面中，寻找 「tracking-event="Search Result Tap"」的dom，取第一个 dom，获取 dom 的链接，进入这个链接
      let albumHref = await page.evaluate(() => {
        const albumHref = document.querySelectorAll('[tracking-event="Search Result Tap"]')[0].querySelector('a').getAttribute('href')
        return albumHref
      });
      await page.goto(albumHref);

      // 选择当前歌曲列表中最接近的歌曲名称，进入该歌曲页面
      let matchSongHref = await page.evaluate(() => {
        let matchSongHref = ''
        let songDomList = document.querySelectorAll('album-tracklist-row')
        songDomList.forEach((item)=>{
          let songNameFromGenius = item.querySelector('h3').innerText
          if(songNameFromGenius.includes(frontEndSongMeta.spotifySong)){
            // @ts-ignore
            matchSongHref = item.querySelector("h3").parentElement.href
          }
        })
        return matchSongHref
      });
      await page.goto(matchSongHref);

      //





    } catch (e){
      console.error(e);
    }
  }


  async getGeniusCommentListForTest(frontEndSongMeta: FrontEndSongMeta){
    try{
      const geniusSearchUrl = `https://genius.com/search?q=${frontEndSongMeta.spotifyAlbum}`
      const browser = await puppeteer.launch({
        headless: false,   //有浏览器界面启动
      });
      const page = await browser.newPage();
      await this.htmlOnly(page)
      await page.setDefaultNavigationTimeout(0);
      await page.goto(geniusSearchUrl, {
        timeout: 1000000,
      });

      // 在上一步的页面中，寻找 「tracking-event="Search Result Tap"」的dom，取第一个 dom，获取 dom 的链接，进入这个链接
      let albumHref = await page.evaluate(() => {
        const albumHref = document.querySelectorAll('[tracking-event="Search Result Tap"]')[0].querySelector('a').getAttribute('href')
        return albumHref
      });
      await page.goto(albumHref);

      // 选择当前歌曲列表中最接近的歌曲名称，进入该歌曲页面
      let matchSongHref = await page.evaluate((frontEndSongMeta) => {
        let matchSongHref = ''
        let songDomList = document.querySelectorAll('album-tracklist-row')
        songDomList.forEach((item)=>{
          let songNameFromGenius = item.querySelector('h3').innerText
          if(songNameFromGenius.includes(frontEndSongMeta.spotifySong)){
            // @ts-ignore
            matchSongHref = item.querySelector("h3").parentElement.href
          }
        })
        return matchSongHref
      }, frontEndSongMeta);
      await page.goto(matchSongHref);

      // 正式进入歌曲页面

      // 爬取以下数据
      // 1. 爬取分词创作背景数据
      // 2. 爬取 about 评论数据
      // 3. 问答数据
      // 4. 创作者相关信息 Credits （未完成，但是思路是读取 window.__PRELOADED_STATE__）
      /*
      * 1. 获取 className 为 jvutUp 的 dom
      * 2. 获取 dom 的 a.href 的分词歌词 id
      * 3. 将分词歌词 id 作为请求参数 ，得到结果https://genius.com/api/referents/${lyricId}?text_format=markdown
      * 4.
      * */
      let {aboutText, questionAndAnswerObjList, lyricAndCommentObjList} = await page.evaluate(()=>{
        let questionAndAnswerObjList: QuestionAndAnswer[] = []
        let lyricAndCommentObjList: LyricAndComment[] = []
        document.querySelectorAll('.jvutUp').forEach((lyricDOM)=>{
          if(!lyricDOM){return}
          let lyricId = lyricDOM.getAttribute('href').split('/')[1]
          // @ts-ignore
          let lyricText = lyricDOM.innerText
          if(!isNaN(parseInt(lyricId))){
            lyricAndCommentObjList.push({
              lyric: lyricText,
              comment: lyricId
            })
          } else {
            console.error("error parse url error ")
          }
        })
        // @ts-ignore
        let answerObj = window.__PRELOADED_STATE__.entities.answers
        // @ts-ignore
        let questionsObj = window.__PRELOADED_STATE__.entities.questions;
        Object.keys(questionsObj).forEach((questionId)=>{
          const questionItem = questionsObj[questionId]
          const question = questionItem.body
          const answerId = questionItem.answer
          const answerItem = answerObj[answerId]
          const answer = answerItem.body.markdown
          const questionAndAnswer: QuestionAndAnswer = {
            answer,
            question
          }
          questionAndAnswerObjList.push(questionAndAnswer)
        })


        const aboutDOM = document.querySelector('[class*="SongDescription"] [class*="RichText__Container"]');
        const aboutText = aboutDOM?.innerHTML || ''

        return {aboutText, questionAndAnswerObjList, lyricAndCommentObjList}
      })
      let promiseList = []
      lyricAndCommentObjList.forEach((lyricAndCommentObj)=>{
        let promise = this.geniusLyricInfoProxy.getCommentOnBackgroundOfWordSegmentation(lyricAndCommentObj.comment)
        promiseList.push(promise)
      })
      let lyricCommentList = await Promise.all(promiseList).then((responseList)=>{

        return responseList

      })
      lyricAndCommentObjList.forEach((lyricAndCommentObj, index )=>{
        lyricAndCommentObj.comment = lyricCommentList[index]
      })

      console.log('aboutText', aboutText);
      console.log('answerMarkDownList', questionAndAnswerObjList);
      console.log('lyricAndCommentObjList', lyricAndCommentObjList);


    } catch (e){
      console.error(e);
    }
  }

  // 对请求做一些过滤操作
  htmlOnly = async (page: Page) => {
    await page.setRequestInterception(true); // enable request interception
    const noRequestUrlList = [
      'image6.pubmatic.com/AdServer/PugMaster',
      'loadeu.exelator.com',
      'loadm.exelator.com',
    ]


    page.on(PageEmittedEvents.Request, (req) => {
      // 过滤请求： 在 google 控制台 =》 network  ，只加载类型为"document", "xhr", "fetch", "script" 的脚本
      if (!["document", "xhr", "fetch", "script"].includes(req.resourceType())) {
        return req.abort();
      }

      // 只加载最高 + 高优先级的资源，其他资源不加载
      // @ts-ignore

      if(this.checkStringInStringList(req.url(), noRequestUrlList)){
        return req.abort();
      }


      req.continue();
    });
  };


  checkStringInStringList(string, stringList){
    let isIncludes = false
    for(let stringItem of stringList){
      if(stringItem.includes(string) || string.includes(stringItem)){
        isIncludes = true
        break
      }
    }
    return isIncludes
  }

  getYTBCommentList(externalId: string){}
}
