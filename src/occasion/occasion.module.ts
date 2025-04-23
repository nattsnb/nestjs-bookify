import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { OccasionService } from './occasion.service';
import { OccasionController } from './occasion.controller';

@Module({
  imports: [DatabaseModule],
  providers: [OccasionService],
  controllers: [OccasionController],
})
export class OccasionModule {}
