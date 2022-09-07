import { SongCommentSource } from "../entities/song-comment.entity";

export class CreateSongCommentDto {
  source: SongCommentSource;
  comment: string;
  extraComment?: string;
  externalId: string;
}
