import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../common/entities/base-entity";

@Entity()
export class SongComment extends BaseEntity{
  @Column()
  source: SongCommentSource;

  @Column({
    type: "text"
  })
  comment: String;

  @Column({type: "text"})
  extraComment: String;

  @Column()
  externalId: string;
}
export enum SongCommentSource{
  genius = "genius",
  youtube = "youtube",
}
