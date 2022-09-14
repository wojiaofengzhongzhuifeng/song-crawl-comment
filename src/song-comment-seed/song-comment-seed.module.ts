import { Module } from '@nestjs/common';
import { SongCommentSeedService } from './song-comment-seed.service';
import { SongCommentSeedController } from './song-comment-seed.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { SongCommentSeed } from "./entities/song-comment-seed.entity";
import { SongCommentCrawler } from "../common/utils/song-comment-crawler";
import { GeniusLyricInfoProxy } from "../common/utils/genius-lyric-info-proxy";
import { SongMetaProxy } from "../common/utils/song-meta-proxy";
import { HttpModule, HttpService } from "@nestjs/axios";
import { SongCommentController } from "../song-comment/song-comment.controller";
import { SongCommentModule } from "../song-comment/song-comment.module";
import { SongCommentService } from "../song-comment/song-comment.service";
import { YoutubeSdkProxy } from "../common/utils/youtube-sdk-proxy";

@Module({
  imports: [TypeOrmModule.forFeature([SongCommentSeed]), HttpModule, SongCommentModule],
  controllers: [SongCommentSeedController],
  providers: [SongCommentSeedService, SongMetaProxy, SongCommentCrawler, GeniusLyricInfoProxy,YoutubeSdkProxy ]
})
export class SongCommentSeedModule {}
