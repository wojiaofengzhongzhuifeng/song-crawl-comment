import { Module } from '@nestjs/common';
import { SongCommentService } from './song-comment.service';
import { SongCommentController } from './song-comment.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { SongComment } from "./entities/song-comment.entity";

@Module({
  controllers: [SongCommentController],
  providers: [SongCommentService],
  imports: [TypeOrmModule.forFeature([SongComment])],
})
export class SongCommentModule {}
