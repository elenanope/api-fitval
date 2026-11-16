import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService],
  imports: [DatabaseModule],
})
export class ClassesModule {}
