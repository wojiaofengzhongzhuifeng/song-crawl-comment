import { Injectable } from '@nestjs/common';
import { FrontEndSongMeta } from "./types/song-meta";


// 核心类：使用这个类爬取歌曲 comment
@Injectable()
export class SongCommentCrawler {
  getCommentList(frontEndSongMeta: FrontEndSongMeta, externalId: string){
    this.getGeniusCommentList(frontEndSongMeta)
    this.getYTBCommentList(externalId)
  }

  getGeniusCommentList(frontEndSongMeta: FrontEndSongMeta){
    console.log('getGeniusCommentList', frontEndSongMeta);
    // todo 核心
  }

  getYTBCommentList(externalId: string){}
}
