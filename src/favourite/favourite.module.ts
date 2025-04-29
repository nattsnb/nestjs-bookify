import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { FavouriteService } from './favourite.service';
import { FavouriteController } from './favourite.controller';

@Module({
  imports: [DatabaseModule],
  providers: [FavouriteService],
  controllers: [FavouriteController],
})
export class FavouriteModule {}
