import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AmenityService } from './amenity.service';
import { AmenityController } from './amenity.controller';

@Module({
  imports: [DatabaseModule],
  providers: [AmenityService],
  controllers: [AmenityController],
})
export class AmenityModule {}
