import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { VenuesAmenitiesService } from './venuesAmenities.service';

@Module({
  imports: [DatabaseModule],
  providers: [VenuesAmenitiesService],
  controllers: [VenuesController],
})
export class VenuesController {}
