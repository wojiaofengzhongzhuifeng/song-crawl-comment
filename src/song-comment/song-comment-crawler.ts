import { Injectable } from '@nestjs/common';
import { FrontEndSongMeta } from "./types/song-meta";
import puppeteer from 'puppeteer'


// 核心类：使用这个类爬取歌曲 comment
@Injectable()
export class SongCommentCrawler {
  async getCommentList(frontEndSongMeta: FrontEndSongMeta, externalId: string){
    await this.getGeniusCommentList(frontEndSongMeta)
    this.getYTBCommentList(externalId)
  }

  async getGeniusCommentList(frontEndSongMeta: FrontEndSongMeta){
    try{
      // 使用 puppeteer 库的无头浏览器打开 `https://genius.com/search?q=${spotifyalbum}` 专辑查找结果页面
      const geniusSearchUrl = `https://genius.com/search?q=${frontEndSongMeta.spotifyAlbum}`
      const browser = await puppeteer.launch({
        headless: false,   //有浏览器界面启动
        timeout: 100000000,
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
            console.log(item.querySelector("h3"));
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

  getYTBCommentList(externalId: string){}
}
