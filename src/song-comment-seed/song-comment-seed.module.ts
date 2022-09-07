import { Module } from '@nestjs/common';
import { SongCommentSeedService } from './song-comment-seed.service';
import { SongCommentSeedController } from './song-comment-seed.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { SongCommentSeed } from "./entities/song-comment-seed.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SongCommentSeed])],
  controllers: [SongCommentSeedController],
  providers: [SongCommentSeedService]
})
export class SongCommentSeedModule {}
