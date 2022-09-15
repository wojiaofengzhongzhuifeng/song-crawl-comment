import { Injectable } from '@nestjs/common';
import { BackEndSongMeta, FrontEndSongMeta } from "../types/song-meta";
import { HttpService } from "@nestjs/axios";
import { map, Observable } from "rxjs";
import { AxiosResponse } from "axios";
import { youtubeSDKAppKey } from "../config";
import * as https from "https";

// 用于发起请求
@Injectable()
export class YoutubeSdkProxy {
  constructor(private readonly httpService: HttpService) {}

  async getYoutubeComment(yid: string): Promise<string[]>{
    console.log("yid getYoutubeComment", yid);
    let requestUrl = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${yid}&key=${youtubeSDKAppKey}&maxResults=10&order=relevance`
    const response: AxiosResponse<YoutubeCommentResponse> = await this.httpService.axiosRef({
      url: requestUrl,
      httpsAgent: new https.Agent({ keepAlive: true }),
    })

    console.log('response getYoutubeComment', response);
    const commentList = []
    try{
      response.data.items.map((youtubeCommentItem)=>{
        const comment = youtubeCommentItem?.snippet?.topLevelComment?.snippet?.textDisplay || ''
        commentList.push(comment)
      })
    } catch(e){
      console.log("eeeeeeee", e)
    }
    return commentList
  }
}
