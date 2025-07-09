import {
  Body,
  Controller,
  Delete,
  Get,
  Head,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { VenueService } from './venue.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { JwtAuthenticationGuard } from '../authentication/jwt-authentication.guard';
import { RequestWithUser } from '../authentication/request-with-user';
import { Response } from 'express';
import { VenueFilterDto } from './dto/venue-filter.dto';
import { UpdateVenueLocationDto } from './dto/update-venue-location.dto';
import { UpdateVenueAmenitiesDto } from './dto/update-venue-amenities.dto';
import { UpdateVenueDetailsDto } from './dto/update-venue-details.dto';

@Controller('venue')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @Get()
  getAll() {
    return this.venueService.getAll();
  }

  @Get('filter')
  findWithFilters(@Query() filterDto: VenueFilterDto) {
    return this.venueService.findWithFilters(filterDto);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  create(
    @Body() createVenueData: CreateVenueDto,
    @Req() request: RequestWithUser,
  ) {
    return this.venueService.create(createVenueData, request.user.id);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.venueService.getOne(id);
  }

  @Patch(':id/location')
  async updateLocation(
    @Param('id') id: number,
    @Body() dto: UpdateVenueLocationDto,
  ) {
    return this.venueService.updateVenueLocation(id, dto);
  }

  @Patch(':id/amenities')
  async updateAmenities(
    @Param('id') id: number,
    @Body() dto: UpdateVenueAmenitiesDto,
  ) {
    return this.venueService.updateVenueAmenities(id, dto);
  }

  @Patch(':id/details')
  async updateDetails(
    @Param('id') id: number,
    @Body() dto: UpdateVenueDetailsDto,
  ) {
    return this.venueService.updateVenueDetails(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.venueService.delete(id);
  }

  @Head()
  headRoute(@Res() response: Response) {
    return response.status(200).send();
  }
}
