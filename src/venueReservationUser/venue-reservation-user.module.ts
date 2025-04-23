import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { VenueReservationUserService } from './venue-reservation-user.service';
import { VenueReservationUserController } from './venue-reservation-user.controller';

@Module({
  imports: [DatabaseModule],
  providers: [VenueReservationUserService],
  controllers: [VenueReservationUserController],
})
export class VenueReservationUserModule {}
