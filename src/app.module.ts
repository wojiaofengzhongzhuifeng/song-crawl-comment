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
import { TypeOrmModule } from "@nestjs/typeorm";

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
    })
  ],
  controllers: [AppController, SongCommentController],
  providers: [AppService, SongCommentService, SongMetaProxy, SongCommentCrawler, GeniusLyricInfoProxy],
})
export class AppModule {}
