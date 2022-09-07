import { PartialType } from '@nestjs/mapped-types';
import { CreateSongCommentSeedDto } from './create-song-comment-seed.dto';

export class UpdateSongCommentSeedDto extends PartialType(CreateSongCommentSeedDto) {}
