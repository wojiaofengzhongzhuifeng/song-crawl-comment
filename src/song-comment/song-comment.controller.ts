import { Controller, Get, Param } from "@nestjs/common";
import { SongCommentService } from "./song-comment.service";
import { SongMetaProxy } from "./song-meta-proxy";

@Controller('song-comment')
export class SongCommentController {
  constructor(
    private readonly songCommentService: SongCommentService,
  ) {}

  @Get("test")
  getTest(){
    return "jfkdlas"
  }

  @Get(':externalId')
  async getSongComment(@Param('externalId') externalId){
    let {...obj} = await this.songCommentService.getComment(externalId)
    return obj
  }
}
