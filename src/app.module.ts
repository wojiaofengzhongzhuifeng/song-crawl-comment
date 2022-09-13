import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from "@nestjs/axios";
import { SongMetaProxy } from "./common/utils/song-meta-proxy";
import { SongCommentCrawler } from "./common/utils/song-comment-crawler";
import { GeniusLyricInfoProxy } from "./common/utils/genius-lyric-info-proxy";
import { SongCommentSeedModule } from './song-comment-seed/song-comment-seed.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { SongCommentModule } from './song-comment/song-comment.module';
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    HttpModule,
    SongCommentSeedModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'song-comment',
      autoLoadEntities: true,
      synchronize: true, // todo 生产环境设置为 false
    }),
    SongCommentModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, SongMetaProxy, SongCommentCrawler, GeniusLyricInfoProxy],
})
export class AppModule {}
