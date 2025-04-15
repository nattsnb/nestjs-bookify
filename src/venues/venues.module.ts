import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { VenuesService } from './venues.service';
import { VenuesController } from './venues.controller';

@Module({
  imports: [DatabaseModule],
  providers: [VenuesService],
  controllers: [VenuesController],
})
export class VenuesModule {}
