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
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { VenueService } from './venue.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { JwtAuthenticationGuard } from '../authentication/jwt-authentication.guard';
import { RequestWithUser } from '../authentication/request-with-user';
import { Response } from 'express';

@Controller('venue')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @Get()
  getAll() {
    return this.venueService.getAll();
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

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVenueData: UpdateVenueDto,
  ) {
    return this.venueService.update(id, updateVenueData);
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
