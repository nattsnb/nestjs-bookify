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
import { OccasionService } from './occasion.service';
import { UpdateOccasionDto } from './dto/update-occasion.dto';
import { CreateOccasionDto } from './dto/create-occasion.dto';

@Controller('occasion')
export class OccasionController {
  constructor(private readonly occasionService: OccasionService) {}

  @Get()
  getAll() {
    return this.occasionService.getAll();
  }

  @Post()
  create(@Body() createOccasionData: CreateOccasionDto) {
    return this.occasionService.create(createOccasionData);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.occasionService.getOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOccasionData: UpdateOccasionDto,
  ) {
    return this.occasionService.update(id, updateOccasionData);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.occasionService.delete(id);
  }
}
