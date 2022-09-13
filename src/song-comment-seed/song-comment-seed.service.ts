import { Injectable } from '@nestjs/common';
import { CreateSongCommentSeedDto } from './dto/create-song-comment-seed.dto';
import { UpdateSongCommentSeedDto } from './dto/update-song-comment-seed.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { SongCommentSeed, SongCommentSeedStatus } from "./entities/song-comment-seed.entity";
import { Repository } from "typeorm";
import { Cron, Interval } from "@nestjs/schedule";
import { SongCommentCrawler } from "../common/utils/song-comment-crawler";

@Injectable()
export class SongCommentSeedService {
  constructor(
    @InjectRepository(SongCommentSeed)
    private readonly songCommentSeedRepository: Repository<SongCommentSeed>,
    private readonly SongCommentCrawler: SongCommentCrawler
  ) {}

  async create(createSongCommentSeedDto: CreateSongCommentSeedDto): Promise<SongCommentSeed> {
    const externalId = createSongCommentSeedDto.externalId;
    // 新建任务，分两个步骤
    // 1. 检查 songCommentSeed 表是否已经存在该 externalId 如果存在，将其设置为 status === PENDING
    const songCommentSeedData = await this.songCommentSeedRepository.findOneBy({ externalId: externalId });
    if(!songCommentSeedData){
      const songCommentSeed = new SongCommentSeed();
      const time = new Date();

      songCommentSeed.externalId = createSongCommentSeedDto.externalId;
      songCommentSeed.status = SongCommentSeedStatus.PENDING;
      songCommentSeed.creation = time;
      songCommentSeed.modification = time;
      songCommentSeed.crawlFaiReason = "";

      return this.songCommentSeedRepository.save(songCommentSeed)
    } else {
      await this.songCommentSeedRepository.update({externalId: externalId}, {status: SongCommentSeedStatus.PENDING});
    }
  }

  findAll() {
    return `This action returns all songCommentSeed`;
  }

  async findOne(id: number) {

  }

  update(id: number, updateSongCommentSeedDto: UpdateSongCommentSeedDto) {
    return `This action updates a #${id} songCommentSeed`;
  }

  remove(id: number) {
    return `This action removes a #${id} songCommentSeed`;
  }


  async test(externalId: string) {
    const commentData = await this.SongCommentCrawler.getCommentList(externalId);
    console.log('commentData11111', commentData);
  }

  @Interval(5000)
  async pollToGetPendingSongCommentSeedData() {
    const pendSongCommentSeedData = await this.songCommentSeedRepository.findOneBy({ status: SongCommentSeedStatus.PENDING });
    if(!pendSongCommentSeedData){return}
    const externalId = pendSongCommentSeedData.externalId;
    console.log(`需要爬取数据${externalId}`);

    await this.songCommentSeedRepository.update({externalId: externalId}, {status: SongCommentSeedStatus.IS_CRAWLING});

    try{
      const commentData = await this.SongCommentCrawler.getCommentList(externalId);
      console.log('commentData', commentData);
      const geniusAboutComment = commentData.genius.aboutText
      const geniusLyricComment = commentData.genius.lyricAndCommentObjList
      const geniusQuestionComment = commentData.genius.questionAndAnswerObjList
    } catch (e){
      console.log("fdsafdsa", e);
      console.log("fdsafdsa", e.message ? e.message : "error");
      const errorMessage = e.message ? e.message : "unknow error"
      await this.songCommentSeedRepository.update({externalId: externalId}, {crawlFaiReason: errorMessage, status: SongCommentSeedStatus.CRAWL_FAILURE});
    }
  }
}
