import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/entities/base-entity";

@Entity()
export class SongCommentSeed extends BaseEntity{

  @Column()
  status: SongCommentSeedStatus;

  @Column()
  crawlFaiReason: string;


  @Column()
  externalId: string; // 不包含 youtube-
}

export enum SongCommentSeedStatus{
  PENDING = "PENDING",
  IS_CRAWLING = "IS_CRAWLING",
  CRAWL_SUCCESS = "CRAWL_SUCCESS",
  CRAWL_FAILURE = "CRAWL_FAILURE",
}
