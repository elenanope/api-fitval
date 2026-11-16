import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';

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
}
