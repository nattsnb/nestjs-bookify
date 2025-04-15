import { Body, Controller, Get, Post } from '@nestjs/common';
import { VenuesAmenitiesService } from './venuesAmenities.service';
import { VenuesAmenitiesDto } from './dto/venuesAmenities.dto';

@Controller('venues-amenities')
export class VenuesAmenitiesController {
  constructor(
    private readonly venuesAmenitiesService: VenuesAmenitiesService,
  ) {}

  @Get()
  get() {
    return this.venuesAmenitiesService.get();
  }

  @Post()
  create(@Body() venuesAmenitiesData: VenuesAmenitiesDto) {
    return this.venuesAmenitiesService.create(venuesAmenitiesData);
  }
}
