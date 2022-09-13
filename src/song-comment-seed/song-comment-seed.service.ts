import { Injectable } from "@nestjs/common";
import { CreateSongCommentSeedDto } from "./dto/create-song-comment-seed.dto";
import { UpdateSongCommentSeedDto } from "./dto/update-song-comment-seed.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { SongCommentSeed, SongCommentSeedStatus } from "./entities/song-comment-seed.entity";
import { Repository } from "typeorm";
import { Interval } from "@nestjs/schedule";
import { SongCommentCrawler } from "../common/utils/song-comment-crawler";
import { SongCommentSource } from "../song-comment/entities/song-comment.entity";
import { CreateSongCommentDto } from "../song-comment/dto/create-song-comment.dto";
import { SongCommentService } from "../song-comment/song-comment.service";

@Injectable()
export class SongCommentSeedService {
  constructor(
    @InjectRepository(SongCommentSeed)
    private readonly songCommentSeedRepository: Repository<SongCommentSeed>,
    private readonly songCommentCrawler: SongCommentCrawler,
    private readonly songCommentService: SongCommentService,
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
    const commentData = await this.songCommentCrawler.getCommentList(externalId);
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
      const commentData = await this.songCommentCrawler.getCommentList(externalId);
      console.log('commentData', commentData);
      const geniusAboutComment = commentData.genius.aboutText
      const geniusLyricComment = commentData.genius.lyricAndCommentObjList
      const geniusQuestionComment = commentData.genius.questionAndAnswerObjList

      if(geniusAboutComment){
        const aboutSongCommentDTO: CreateSongCommentDto = {
          source: SongCommentSource.genius,
          comment: geniusAboutComment,
          externalId,
        }

        await this.songCommentService.create(aboutSongCommentDTO)
      }

      if(geniusLyricComment.length !== 0){
        const lyricSongCommentDTOList: CreateSongCommentDto[] = []
        geniusLyricComment.map((lyricAndComment)=>{
          lyricAndComment.comment.forEach((comment)=>{
            const createSongCommentDto: CreateSongCommentDto = {
              source: SongCommentSource.genius,
              comment: comment,
              extraComment: lyricAndComment.lyric,
              externalId,
            }
            lyricSongCommentDTOList.push(createSongCommentDto)
          })
        })
        for (const lyricSongCommentDTO of lyricSongCommentDTOList) {
          await this.songCommentService.create(lyricSongCommentDTO)
        }
      }

      if(geniusQuestionComment.length !== 0){
        const questionSongCommentDTOList: CreateSongCommentDto[] = geniusQuestionComment.map((questionAndAnswer)=>{
          return {
            source: SongCommentSource.genius,
            comment: questionAndAnswer.answer,
            extraComment: questionAndAnswer.question,
            externalId,
          }
        })
        for (const lyricSongCommentDTO of questionSongCommentDTOList) {
          await this.songCommentService.create(lyricSongCommentDTO)
        }
      }


    } catch (e){
      console.log("fdsafdsa", e);
      console.log("fdsafdsa", e.message ? e.message : "error");
      const errorMessage = e.message ? e.message : "unknow error"
      await this.songCommentSeedRepository.update({externalId: externalId}, {crawlFaiReason: errorMessage, status: SongCommentSeedStatus.CRAWL_FAILURE});
    }
  }
}
