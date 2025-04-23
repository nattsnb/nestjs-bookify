import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { VenueFavouriteUserService } from './venue-favourite-user.service';
import { VenueFavouriteUserController } from './venue-favourite-user.controller';

@Module({
  imports: [DatabaseModule],
  providers: [VenueFavouriteUserService],
  controllers: [VenueFavouriteUserController],
})
export class VenueFavouriteUserModule {}
