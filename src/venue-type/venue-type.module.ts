import { Module } from '@nestjs/common';
import { VenueTypeController } from './venue-type.controller';
import { VenueTypeService } from './venue-type.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [VenueTypeController],
  providers: [VenueTypeService, PrismaService],
})
export class VenueTypeModule {}
