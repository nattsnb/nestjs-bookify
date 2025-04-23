import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly occasionService: CategoryService) {}

  @Get()
  getAll() {
    return this.occasionService.getAll();
  }

  @Post()
  create(@Body() createOccasionData: CreateCategoryDto) {
    return this.occasionService.create(createOccasionData);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.occasionService.getOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOccasionData: UpdateCategoryDto,
  ) {
    return this.occasionService.update(id, updateOccasionData);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.occasionService.delete(id);
  }
}
