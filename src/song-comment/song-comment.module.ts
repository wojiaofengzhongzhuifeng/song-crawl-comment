import { Module } from '@nestjs/common';
import { SongCommentService } from './song-comment.service';
import { SongCommentController } from './song-comment.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { SongComment } from "./entities/song-comment.entity";

@Module({
  controllers: [SongCommentController],
  providers: [SongCommentService],
  imports: [TypeOrmModule.forFeature([SongComment])],
  // song-comment-seed 需要使用 SongCommentService， 所以新增这个 exports
  exports: [SongCommentService]
})
export class SongCommentModule {}
