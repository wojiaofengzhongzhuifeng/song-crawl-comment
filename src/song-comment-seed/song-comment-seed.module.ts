import { Module } from '@nestjs/common';
import { SongCommentSeedService } from './song-comment-seed.service';
import { SongCommentSeedController } from './song-comment-seed.controller';

@Module({
  controllers: [SongCommentSeedController],
  providers: [SongCommentSeedService]
})
export class SongCommentSeedModule {}
