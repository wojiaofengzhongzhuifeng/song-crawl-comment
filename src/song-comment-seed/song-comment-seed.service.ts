import { Injectable } from "@nestjs/common";
import { CreateSongCommentSeedDto } from "./dto/create-song-comment-seed.dto";
import { UpdateSongCommentSeedDto } from "./dto/update-song-comment-seed.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { SongCommentSeed, SongCommentSeedStatus } from "./entities/song-comment-seed.entity";
import { Repository } from "typeorm";
import { Interval } from "@nestjs/schedule";
import { SongCommentCrawler } from "../common/utils/song-comment-crawler";
import { SongCommentSource, SongCommentType } from "../song-comment/entities/song-comment.entity";
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
      songCommentSeed.geniusSongUrl = "";
      songCommentSeed.geniusSearchUrl = "";

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

  async update(externalId: string, updateSongCommentSeedDto: UpdateSongCommentSeedDto) {
    await this.songCommentSeedRepository.update({ externalId, }, updateSongCommentSeedDto)
    return "update";
  }

  remove(id: number) {
    return `This action removes a #${id} songCommentSeed`;
  }


  async test(externalId: string) {
    const commentData = await this.songCommentCrawler.getMetaAndGetGeniusCommentList(externalId);
    console.log('commentData11111', commentData);
  }

  async getAndSaveYoutubeCommentListToDB(id: string) {
    let youtubeCommentList = await this.songCommentCrawler.getAndSaveYoutubeCommentList(id);
    console.log("service youtubeCommentList", youtubeCommentList);

    if(youtubeCommentList.length !== 0){
      const youtubeLyricSongCommentDTOList: CreateSongCommentDto[] = []
      youtubeCommentList.map((youtubeComment)=>{
        const createSongCommentDto: CreateSongCommentDto = {
          source: SongCommentSource.youtube,
          comment: youtubeComment,
          extraComment: "",
          externalId: id,
          type: SongCommentType.default
        }
        youtubeLyricSongCommentDTOList.push(createSongCommentDto)
      })
      for (const youtubeLyricSongCommentDTO of youtubeLyricSongCommentDTOList) {
        await this.songCommentService.create(youtubeLyricSongCommentDTO)
      }
    }

  }

  @Interval(5000)
  async pollToGetPendingSongCommentSeedData() {
    const haveIsCrawlingData = await this.songCommentSeedRepository.findOneBy({status: SongCommentSeedStatus.IS_CRAWLING})
    if(haveIsCrawlingData){return}
    const pendSongCommentSeedData = await this.songCommentSeedRepository.findOneBy({ status: SongCommentSeedStatus.PENDING });
    if(!pendSongCommentSeedData){return}

    const externalId = pendSongCommentSeedData.externalId;
    console.log(`需要爬取数据${externalId}`);
    await this.songCommentSeedRepository.update({externalId: externalId}, {status: SongCommentSeedStatus.IS_CRAWLING});
    try{
      await this.getAndSaveYoutubeCommentListToDB(externalId)
      const commentData = await this.songCommentCrawler.getMetaAndGetGeniusCommentList(externalId);
      const geniusAboutComment = commentData.genius.aboutText
      const geniusLyricComment = commentData.genius.lyricAndCommentObjList
      const geniusQuestionComment = commentData.genius.questionAndAnswerObjList

      const {geniusSearchUrl, geniusSongUrl} = commentData.songCommentSeed

      await this.songCommentSeedRepository.update({ externalId, }, {geniusSearchUrl, geniusSongUrl})

      if(geniusAboutComment){
        const aboutSongCommentDTO: CreateSongCommentDto = {
          source: SongCommentSource.genius,
          comment: geniusAboutComment,
          externalId,
          type: SongCommentType.about,
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
              type: SongCommentType.lyric
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
            type: SongCommentType.question
          }
        })
        for (const lyricSongCommentDTO of questionSongCommentDTOList) {
          await this.songCommentService.create(lyricSongCommentDTO)
        }
      }

      await this.songCommentSeedRepository.update({externalId: externalId}, {status: SongCommentSeedStatus.CRAWL_SUCCESS});
      console.log(`爬取评论结束： ${externalId}`)

    } catch (e){
      console.log("fdsafdsa", e);
      console.log("fdsafdsa", e.message ? e.message : "error");
      const errorMessage = e.message ? e.message : "unknow error"
      await this.songCommentSeedRepository.update({externalId: externalId}, {crawlFaiReason: errorMessage, status: SongCommentSeedStatus.CRAWL_FAILURE});
    }
  }

  // 检查数据库中 geniusSongUrl 列的值是否存在 search 字符串 ，如果存在，说明有问题，需要将这个值 status 设置为 PENDING
  @Interval(10000)
  async pollToRefreshError(){
    const sql = `SELECT * FROM song_comment_seed WHERE STATUS = "CRAWL_SUCCESS" AND geniusSongUrl LIKE '%search?q=%' limit 1`
    const haveProblemSongDataList = await this.songCommentSeedRepository.query(sql);


    if(haveProblemSongDataList.length === 0){return}
    const matchHaveProblemSongData = haveProblemSongDataList[0]
    const externalId = matchHaveProblemSongData.externalId

    await this.songCommentService.remove(externalId)
    await this.songCommentSeedRepository.update({externalId}, {status: SongCommentSeedStatus.PENDING})
  }

  // 检查数据库中 status === failure , 将其转化为 pending
  // @Interval(10000)
  async pollToRefreshFailureData(){
    const sql = `SELECT * FROM song_comment_seed WHERE STATUS = "CRAWL_FAILURE" limit 1`
    const failureSongDataList = await this.songCommentSeedRepository.query(sql);


    if(failureSongDataList.length === 0){return}
    const matchHaveProblemSongData = failureSongDataList[0]
    const externalId = matchHaveProblemSongData.externalId

    await this.songCommentService.remove(externalId)
    await this.songCommentSeedRepository.update({externalId}, {status: SongCommentSeedStatus.PENDING})
  }
}
