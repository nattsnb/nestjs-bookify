import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';

@Module({
  imports: [DatabaseModule],
  providers: [ReservationService],
  controllers: [ReservationController],
})
export class ReservationModule {}
