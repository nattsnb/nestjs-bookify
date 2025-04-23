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
import { AmenityService } from './amenity.service';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { CreateAmenityDto } from './dto/create-amenity.dto';

@Controller('amenity')
export class AmenityController {
  constructor(private readonly amenityService: AmenityService) {}

  @Get()
  getAll() {
    return this.amenityService.getAll();
  }

  @Post()
  create(@Body() createAmenityData: CreateAmenityDto) {
    return this.amenityService.create(createAmenityData);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.amenityService.getOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAmenityData: UpdateAmenityDto,
  ) {
    return this.amenityService.update(id, updateAmenityData);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.amenityService.delete(id);
  }
}
