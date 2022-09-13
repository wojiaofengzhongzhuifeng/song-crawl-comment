import { Injectable } from '@nestjs/common';
import { BackEndSongMeta, FrontEndSongMeta } from "../types/song-meta";
import { HttpService } from "@nestjs/axios";
import { map, Observable } from "rxjs";
import { AxiosResponse } from "axios";
import { CommentOnBackgroundOfWordSegmentation } from "../types/comment-on-background-of-word-segmentation";

// 用于发起请求
@Injectable()
export class GeniusLyricInfoProxy {
  constructor(private readonly httpService: HttpService) {}

  // 获取分词创作背景评论数据
  async getCommentOnBackgroundOfWordSegmentation(lyricId: string): Promise<string[]>{
    let requestUrl = `https://genius.com/api/referents/${lyricId}?text_format=markdown`
    const response: AxiosResponse<CommentOnBackgroundOfWordSegmentation> = await this.httpService.axiosRef.get(requestUrl)
    return response.data.response.referent.annotations.map((annotation)=>annotation.body.markdown)
  }
}
