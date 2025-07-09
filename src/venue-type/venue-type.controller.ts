import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { VenueTypeService } from './venue-type.service';
import { CreateVenueTypeDto } from './dto/create-venue-type.dto';

@Controller('venue-type')
export class VenueTypeController {
  constructor(private readonly venueTypeService: VenueTypeService) {}

  @Get()
  getAll() {
    return this.venueTypeService.getAll();
  }

  @Post()
  create(@Body() createVenueTypeData: CreateVenueTypeDto) {
    return this.venueTypeService.create(createVenueTypeData);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.venueTypeService.getOne(id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.venueTypeService.delete(id);
  }
}
