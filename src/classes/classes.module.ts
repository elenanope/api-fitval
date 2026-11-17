import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService],
  imports: [DatabaseModule, UsersModule],
})
export class ClassesModule {}
