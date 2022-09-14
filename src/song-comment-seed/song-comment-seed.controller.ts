import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SongCommentSeedService } from './song-comment-seed.service';
import { CreateSongCommentSeedDto } from './dto/create-song-comment-seed.dto';
import { UpdateSongCommentSeedDto } from './dto/update-song-comment-seed.dto';

@Controller('song-comment-seed')
export class SongCommentSeedController {
  constructor(private readonly songCommentSeedService: SongCommentSeedService) {}

  @Get(":id")
  test(
    @Param('id') id: string
  ){
    return this.songCommentSeedService.test(id)
  }

  @Get("/youtube/:id")
  testGetYoutubeCommentList(
    @Param('id') id: string
  ){
    return this.songCommentSeedService.getAndSaveYoutubeCommentListToDB(id)
  }

  @Post()
  create(@Body() createSongCommentSeedDto: CreateSongCommentSeedDto) {
    return this.songCommentSeedService.create(createSongCommentSeedDto);
  }

  @Get()
  findAll() {
    return this.songCommentSeedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songCommentSeedService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSongCommentSeedDto: UpdateSongCommentSeedDto) {
  //   return this.songCommentSeedService.update(+id, updateSongCommentSeedDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.songCommentSeedService.remove(+id);
  }
}
