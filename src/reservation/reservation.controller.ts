import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthenticationGuard } from '../authentication/jwt-authentication.guard';
import { RequestWithUser } from '../authentication/request-with-user';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ReservationDto } from './dto/reservation.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  getAll() {
    return this.reservationService.getAll();
  }

  @Get('user/:id')
  getByUser(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.getByUser(id);
  }

  @Get('venue/:id')
  getByVenue(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.getByVenue(id);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.getOne(id);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  create(
    @Body() createReservationData: CreateReservationDto,
    @Req() request: RequestWithUser,
  ) {
    return this.reservationService.create(
      createReservationData,
      request.user.id,
    );
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.delete(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.changeIsActive(id);
  }
}
