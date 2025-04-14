import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { VenuesDetailsService } from './venuesDetails.service';

@Module({
  imports: [DatabaseModule],
  providers: [VenuesDetailsService],
  controllers: [VenuesController],
})
export class VenuesController {}
