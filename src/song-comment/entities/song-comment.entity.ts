import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../common/entities/base-entity";

@Entity()
export class SongComment extends BaseEntity{
  @Column()
  source: SongCommentSource;

  @Column()
  comment: String;

  @Column({default: ''})
  extraComment: String;

  @Column()
  externalId: string;
}
export enum SongCommentSource{
  genius = "genius",
  youtube = "youtube",
}
