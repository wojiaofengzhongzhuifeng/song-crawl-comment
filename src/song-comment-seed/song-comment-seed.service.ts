import { Injectable } from '@nestjs/common';
import { CreateSongCommentSeedDto } from './dto/create-song-comment-seed.dto';
import { UpdateSongCommentSeedDto } from './dto/update-song-comment-seed.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { SongCommentSeed, SongCommentSeedStatus } from "./entities/song-comment-seed.entity";
import { Repository } from "typeorm";

@Injectable()
export class SongCommentSeedService {
  constructor(
    @InjectRepository(SongCommentSeed)
    private readonly songCommentSeedRepository: Repository<SongCommentSeed>,
  ) {}

  create(createSongCommentSeedDto: CreateSongCommentSeedDto): Promise<SongCommentSeed> {
    const songCommentSeed = new SongCommentSeed();
    const time = new Date();

    songCommentSeed.externalId = createSongCommentSeedDto.externalId;
    songCommentSeed.status = SongCommentSeedStatus.PENDING;
    songCommentSeed.creation = time;
    songCommentSeed.modification = time;
    songCommentSeed.crawlFaiReason = "";

    return this.songCommentSeedRepository.save(songCommentSeed)
  }

  findAll() {
    return `This action returns all songCommentSeed`;
  }

  findOne(id: number) {
    return `This action returns a #${id} songCommentSeed`;
  }

  update(id: number, updateSongCommentSeedDto: UpdateSongCommentSeedDto) {
    return `This action updates a #${id} songCommentSeed`;
  }

  remove(id: number) {
    return `This action removes a #${id} songCommentSeed`;
  }
}
