import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { VenuesDetailsService } from './venuesDetails.service';
import { VenuesDetailsController } from './venuesDetails.controller';

@Module({
  imports: [DatabaseModule],
  providers: [VenuesDetailsService],
  controllers: [VenuesDetailsController],
})
export class VenuesDetailsModule {}
