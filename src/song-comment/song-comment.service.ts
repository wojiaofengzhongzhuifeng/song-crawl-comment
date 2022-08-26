import { Injectable } from '@nestjs/common';
import { SongMetaProxy } from "./song-meta-proxy";
import { SongCommentCrawler } from "./song-comment-crawler";

@Injectable()
export class SongCommentService {
  constructor(
    private readonly songMetaProxy: SongMetaProxy,
    private readonly songCommentCrawler: SongCommentCrawler,
  ) {}

  async getComment(externalId: string){
    // 1. 根据 youtube id 获取 meta 信息
    let songMeta = await this.songMetaProxy.getMetaByYTBId(externalId)

    // 2. 使用 meta 信息请求相应网站的数据
    await this.songCommentCrawler.getCommentList(songMeta, externalId)
  }
}
