import { Body, Controller, Get, Post } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { CreateVenueDto } from './dto/create-venue.dto';

@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Get()
  getAll() {
    return this.venuesService.getAll();
  }

  @Post()
  create(@Body() venueData: CreateVenueDto) {
    return this.venuesService.create(venueData);
  }
}
