import { Module } from '@nestjs/common';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [TrainersController],
  providers: [TrainersService],
  imports: [DatabaseModule, UsersModule],
})
export class TrainersModule {}
