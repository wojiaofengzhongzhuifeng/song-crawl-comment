import { Injectable } from '@nestjs/common';
import { CreateSongCommentSeedDto } from './dto/create-song-comment-seed.dto';
import { UpdateSongCommentSeedDto } from './dto/update-song-comment-seed.dto';

@Injectable()
export class SongCommentSeedService {
  create(createSongCommentSeedDto: CreateSongCommentSeedDto) {
    return 'This action adds a new songCommentSeed';
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
