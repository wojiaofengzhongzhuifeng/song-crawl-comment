import { PartialType } from '@nestjs/mapped-types';
import { SongCommentSeed } from '../entities/song-comment-seed.entity';

export class UpdateSongCommentSeedDto extends PartialType(SongCommentSeed) {}
