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

  @Column({default: 'default'})
  type: SongCommentType
}
export enum SongCommentSource{
  genius = "genius",
  youtube = "youtube",
}
// 只有爬取 genius 才有的数据类型
export enum SongCommentType {
  about = 'about',
  lyric = 'lyric',
  question = 'question',
  default = "default"
}
