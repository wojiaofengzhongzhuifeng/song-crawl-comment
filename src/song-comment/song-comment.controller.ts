import { Controller, Get, Param } from "@nestjs/common";
import { SongCommentService } from "./song-comment.service";
import { SongMetaProxy } from "./song-meta-proxy";

@Controller('song-comment')
export class SongCommentController {
  constructor(
    private readonly songCommentService: SongCommentService,
  ) {}

  @Get(':externalId')
  async getSongComment(@Param('externalId') externalId){
    this.songCommentService.getComment(externalId)
    return externalId
  }
}
