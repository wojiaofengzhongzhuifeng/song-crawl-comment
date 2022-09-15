import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SongCommentService } from './song-comment.service';
import { CreateSongCommentDto } from './dto/create-song-comment.dto';
import { UpdateSongCommentDto } from './dto/update-song-comment.dto';

@Controller('song-comment')
export class SongCommentController {
  constructor(private readonly songCommentService: SongCommentService) {}

  @Post()
  create(@Body() createSongCommentDto: CreateSongCommentDto) {
    return this.songCommentService.create(createSongCommentDto);
  }

  @Get()
  findAll() {
    return this.songCommentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songCommentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSongCommentDto: UpdateSongCommentDto) {
    return this.songCommentService.update(+id, updateSongCommentDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.songCommentService.remove(+id);
  // }
}
