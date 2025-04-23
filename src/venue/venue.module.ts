import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { VenueService } from './venue.service';
import { VenueController } from './venue.controller';

@Module({
  imports: [DatabaseModule],
  providers: [VenueService],
  controllers: [VenueController],
})
export class VenueModule {}
