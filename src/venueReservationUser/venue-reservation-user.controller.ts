import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VenueReservationUserService } from './venue-reservation-user.service';
import { CreateVenueReservationUserDto } from './dto/create-venue-reservation-user.dto';
import { JwtAuthenticationGuard } from '../authentication/jwt-authentication.guard';
import { RequestWithUser } from '../authentication/request-with-user';

@Controller('venue-reservation-user')
export class VenueReservationUserController {
  constructor(
    private readonly venueReservationUserService: VenueReservationUserService,
  ) {}

  @Get()
  getAll() {
    return this.venueReservationUserService.getAll();
  }

  @Get('user/:id')
  getByUser(@Param('id', ParseIntPipe) id: number) {
    return this.venueReservationUserService.getByUser(id);
  }

  @Get('venue/:id')
  getByVenue(@Param('id', ParseIntPipe) id: number) {
    return this.venueReservationUserService.getByVenue(id);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.venueReservationUserService.getOne(id);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  create(
    @Body() createVenueReservationUserData: CreateVenueReservationUserDto,
    @Req() request: RequestWithUser,
  ) {
    return this.venueReservationUserService.create(
      createVenueReservationUserData,
      request.user.id,
    );
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.venueReservationUserService.delete(id);
  }
}
