import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/entities/base-entity";


export enum SongCommentSeedStatus{
  PENDING = "PENDING",
  IS_CRAWLING = "IS_CRAWLING",
  CRAWL_SUCCESS = "CRAWL_SUCCESS",
  CRAWL_FAILURE = "CRAWL_FAILURE",
}

@Entity()
export class SongCommentSeed extends BaseEntity{

  @Column({
    type: "enum",
    enum: SongCommentSeedStatus,
    default: SongCommentSeedStatus.PENDING
  })
  status: SongCommentSeedStatus;

  @Column()
  crawlFaiReason: string;


  @Column()
  externalId: string; // 不包含 youtube-

  @Column()
  geniusSearchUrl: string; // 使用无头浏览器，第一步进入的页面

  @Column()
  geniusSongUrl: string; // 使用 meta + genius 最终进入的歌曲详情界面
}

