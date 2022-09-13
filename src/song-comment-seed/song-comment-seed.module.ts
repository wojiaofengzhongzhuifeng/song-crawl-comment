import { Module } from '@nestjs/common';
import { SongCommentSeedService } from './song-comment-seed.service';
import { SongCommentSeedController } from './song-comment-seed.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { SongCommentSeed } from "./entities/song-comment-seed.entity";
import { SongCommentCrawler } from "../common/utils/song-comment-crawler";
import { GeniusLyricInfoProxy } from "../common/utils/genius-lyric-info-proxy";
import { SongMetaProxy } from "../common/utils/song-meta-proxy";
import { HttpModule, HttpService } from "@nestjs/axios";

@Module({
  imports: [TypeOrmModule.forFeature([SongCommentSeed]), HttpModule],
  controllers: [SongCommentSeedController],
  providers: [SongCommentSeedService, SongMetaProxy, SongCommentCrawler, GeniusLyricInfoProxy]
})
export class SongCommentSeedModule {}
