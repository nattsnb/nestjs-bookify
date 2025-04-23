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
import { VenueRatingUserService } from './venue-rating-user.service';
import { CreateVenueRatingUserDto } from './dto/create-venue-rating-user.dto';
import { JwtAuthenticationGuard } from '../authentication/jwt-authentication.guard';
import { RequestWithUser } from '../authentication/request-with-user';

@Controller('venue-rating-user')
export class VenueRatingUserController {
  constructor(
    private readonly venueRatingUserService: VenueRatingUserService,
  ) {}

  @Get()
  getAll() {
    return this.venueRatingUserService.getAll();
  }

  @Get('user/:id')
  getByUser(@Param('id', ParseIntPipe) id: number) {
    return this.venueRatingUserService.getByUser(id);
  }

  @Get('venue/:id')
  getByVenue(@Param('id', ParseIntPipe) id: number) {
    return this.venueRatingUserService.getByVenue(id);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.venueRatingUserService.getOne(id);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  create(
    @Body() createVenueRatingUserData: CreateVenueRatingUserDto,
    @Req() request: RequestWithUser,
  ) {
    return this.venueRatingUserService.create(
      createVenueRatingUserData,
      request.user.id,
    );
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.venueRatingUserService.delete(id);
  }
}
