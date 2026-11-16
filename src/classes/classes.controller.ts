import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';

@Controller('classes')
export class ClassesController {
    constructor(private readonly classesService: ClassesService) {}

  @Get() // GET /api/classes
  findAll(@Query('activity')activity?: string) {
    return this.classesService.findAll(activity);
  }

  @Get(':id') // GET /api/classes/1
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.findOne(id);
  }
  
  @Post() // POST /api/classes
  create(@Body() dto: CreateClassDto) {
    return this.classesService.create(dto);
  }

  @Delete(':id') // DELETE /api/classes/1
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.remove(id);
  }
}
