import { SongCommentSource, SongCommentType } from "../entities/song-comment.entity";

export class CreateSongCommentDto {
  source: SongCommentSource;
  comment: string;
  extraComment?: string;
  externalId: string;
  type: SongCommentType;
}
