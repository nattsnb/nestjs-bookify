import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { VenueService } from './venue.service';
import { VenueController } from './venue.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule, HttpModule],
  providers: [VenueService],
  controllers: [VenueController],
})
export class VenueModule {}
