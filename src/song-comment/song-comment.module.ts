import { Module } from '@nestjs/common';
import { SongCommentService } from './song-comment.service';
import { SongCommentController } from './song-comment.controller';

@Module({
  controllers: [SongCommentController],
  providers: [SongCommentService]
})
export class SongCommentModule {}
