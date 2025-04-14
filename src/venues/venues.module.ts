import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { VenuesService } from './venues.service';

@Module({
  imports: [DatabaseModule],
  providers: [VenuesService],
  controllers: [VenuesController],
})
export class VenuesController {}
