import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { VenuesAmenitiesService } from './venuesAmenities.service';
import { VenuesAmenitiesController } from './venuesAmenities.controller';

@Module({
  imports: [DatabaseModule],
  providers: [VenuesAmenitiesService],
  controllers: [VenuesAmenitiesController],
})
export class VenuesAmenitiesModule {}
