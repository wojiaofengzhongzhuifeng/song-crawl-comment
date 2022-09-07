import { PartialType } from '@nestjs/mapped-types';
import { CreateSongCommentDto } from './create-song-comment.dto';

export class UpdateSongCommentDto extends PartialType(CreateSongCommentDto) {}
