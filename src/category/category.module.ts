import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [DatabaseModule],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
