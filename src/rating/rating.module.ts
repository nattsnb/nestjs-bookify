import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';

@Module({
  imports: [DatabaseModule],
  providers: [RatingService],
  controllers: [RatingController],
})
export class RatingModule {}
