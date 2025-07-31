import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { ReservationService } from '../reservation/reservation.service';

@Module({
  imports: [DatabaseModule],
  providers: [RatingService, ReservationService],
  controllers: [RatingController],
})
export class RatingModule {}
