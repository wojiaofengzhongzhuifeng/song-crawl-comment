import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongCommentController } from './song-comment/song-comment.controller';
import { SongCommentService } from './song-comment/song-comment.service';
import { HttpModule } from "@nestjs/axios";
import { SongMetaProxy } from "./song-comment/song-meta-proxy";
import { SongCommentCrawler } from "./song-comment/song-comment-crawler";


@Module({
  imports: [HttpModule],
  controllers: [AppController, SongCommentController],
  providers: [AppService, SongCommentService, SongMetaProxy, SongCommentCrawler],
})
export class AppModule {}
