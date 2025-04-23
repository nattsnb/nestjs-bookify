import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { VenueRatingUserService } from './venue-rating-user.service';
import { VenueRatingUserController } from './venue-rating-user.controller';

@Module({
  imports: [DatabaseModule],
  providers: [VenueRatingUserService],
  controllers: [VenueRatingUserController],
})
export class VenueRatingUserModule {}
