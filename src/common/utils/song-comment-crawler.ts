import { Injectable } from "@nestjs/common";
import { FrontEndSongMeta } from "../types/song-meta";
import puppeteer, { Page, PageEmittedEvents } from "puppeteer";
import { GeniusLyricInfoProxy } from "./genius-lyric-info-proxy";
import { SongMetaProxy } from "./song-meta-proxy";
import { LyricAndComment, QuestionAndAnswer } from "../types/common";

// 核心类：使用这个类爬取歌曲 comment
@Injectable()
export class SongCommentCrawler {

  constructor(
    private readonly geniusLyricInfoProxy: GeniusLyricInfoProxy,
    private readonly songMetaProxy: SongMetaProxy,
  ) {}

  page = null

  async getCommentList(externalId: string){
    // 1. 根据 youtube id 获取 meta 信息
    let songMeta = await this.songMetaProxy.getMetaByYTBId(externalId)
    console.log("通过我们的 api 得到数据 meta 结果", JSON.stringify(songMeta));
    let {aboutText, questionAndAnswerObjList, lyricAndCommentObjList} = await this.getGeniusCommentList(songMeta)
    this.getYTBCommentList(externalId)
    return {genius: {aboutText, questionAndAnswerObjList, lyricAndCommentObjList}}
  }


  async initChrome(){
    console.log("initChrome");
    const browser = await puppeteer.launch({
      headless: false,   //有浏览器界面启动
    });
    this.page = await browser.newPage();
    await this.htmlOnly(this.page)
    this.page.setDefaultNavigationTimeout(0);
  }

  async gotoPageSearchByAlbumName(frontEndSongMeta: FrontEndSongMeta){
    console.log("gotoAlbumPage");
    const geniusSearchUrl = `https://genius.com/search?q=${frontEndSongMeta.spotifyAlbum}`
    console.log(`第一步：进入${geniusSearchUrl}页面`)
    await this.page.goto(geniusSearchUrl, {
      timeout: 1000000,
    });
  }
  async findMostMatchAlbumInPageSearchByAlbumName(){
    // 在上一步的页面中，寻找 「tracking-event="Search Result Tap"」的dom，取第一个 dom，获取 dom 的链接，进入这个链接
    return await this.page.evaluate(() => {
      return document.querySelectorAll('[tracking-event="Search Result Tap"]')[0].querySelector('a').getAttribute('href')
    })
  }

  async goToMostMatchAlbumPage(){
    let songHref = await this.findMostMatchAlbumInPageSearchByAlbumName()
    console.log(`第二步：进入最匹配的搜索结果页面${songHref}, 注意此页面可能是 album 的结果，也可能是 song 的结果`)
    await this.page.goto(songHref);
  }

  async findMostMatchSongInAlbumPage(frontEndSongMeta){
    // 选择当前歌曲列表中最接近的歌曲名称，进入该歌曲页面
    return await this.page.evaluate((frontEndSongMeta) => {
      let matchSongHref = ''
      let songDomList = document.querySelectorAll('album-tracklist-row')
      songDomList.forEach((item) => {
        let songNameFromGenius = item.querySelector('h3').innerText
        if (songNameFromGenius.includes(frontEndSongMeta.spotifySong)) {
          // @ts-ignore
          matchSongHref = item.querySelector("h3").parentElement.href
        }
      })
      return matchSongHref
    }, frontEndSongMeta)
  }

  async gotoMostMatchSongPage(frontEndSongMeta){
    let matchSongHref = await this.findMostMatchSongInAlbumPage(frontEndSongMeta)
    console.log(`第三步：进入到最匹配的歌曲详情${matchSongHref}`)
    if(matchSongHref){
      await this.page.goto(matchSongHref);
    }
  }

  async getCommentDataFromSongPage(): Promise<{aboutText: string, questionAndAnswerObjList: QuestionAndAnswer[], lyricAndCommentObjList: LyricAndComment[]}>{
    console.log("getCommentDataFromSongPage");
    // 当前的 this.page 表示进入了歌曲详情页面
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
    let {aboutText, questionAndAnswerObjList, lyricAndCommentObjList} = await this.page.evaluate(()=>{
      let questionAndAnswerObjList: QuestionAndAnswer[] = []
      let lyricAndCommentObjList: LyricAndComment[] = []
      let aboutText = ""
      document.querySelectorAll('.jvutUp').forEach((lyricDOM)=>{
        if(!lyricDOM){return}
        let lyricId: any = lyricDOM.getAttribute('href').split('/')[1]
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

      if(questionsObj && answerObj){
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
      }



      const aboutDOM = document.querySelector('[class*="SongDescription"] [class*="RichText__Container"]');
      aboutText = aboutDOM?.innerHTML || ''
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
    return {aboutText, questionAndAnswerObjList, lyricAndCommentObjList}
  }


  async getGeniusCommentList(frontEndSongMeta: FrontEndSongMeta){
    await this.initChrome()
    await this.gotoPageSearchByAlbumName(frontEndSongMeta)
    await this.goToMostMatchAlbumPage()
    await this.gotoMostMatchSongPage(frontEndSongMeta)

    // 正式进入歌曲页面
    let {aboutText, questionAndAnswerObjList, lyricAndCommentObjList} = await this.getCommentDataFromSongPage()

    return {aboutText, questionAndAnswerObjList, lyricAndCommentObjList}
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
