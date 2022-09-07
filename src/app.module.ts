import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongCommentController } from './song-comment/song-comment.controller';
import { SongCommentService } from './song-comment/song-comment.service';
import { HttpModule } from "@nestjs/axios";
import { SongMetaProxy } from "./song-comment/song-meta-proxy";
import { SongCommentCrawler } from "./song-comment/song-comment-crawler";
import { GeniusLyricInfoProxy } from "./song-comment/genius-lyric-info-proxy";
import { SongCommentSeedModule } from './song-comment-seed/song-comment-seed.module';


@Module({
  imports: [HttpModule, SongCommentSeedModule],
  controllers: [AppController, SongCommentController],
  providers: [AppService, SongCommentService, SongMetaProxy, SongCommentCrawler, GeniusLyricInfoProxy],
})
export class AppModule {}
