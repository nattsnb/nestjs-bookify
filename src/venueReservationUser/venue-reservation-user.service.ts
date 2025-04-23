import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateVenueReservationUserDto } from './dto/create-venue-reservation-user.dto';

@Injectable()
export class VenueReservationUserService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.venueReservationUser.findMany();
  }

  async create(
    createVenueReservationUserData: CreateVenueReservationUserDto,
    userId: number,
  ) {
    const { venueId, ...venueReservationUserData } =
      createVenueReservationUserData;

    return await this.prismaService.venueReservationUser.create({
      data: {
        venue: { connect: { id: venueId } },
        user: { connect: { id: userId } },
        ...venueReservationUserData,
      },
    });
  }

  getOne(venueRatingUserId: number) {
    return this.prismaService.venueReservationUser.findUnique({
      where: {
        id: venueRatingUserId,
      },
    });
  }

  getByVenue(venueId: number) {
    return this.prismaService.venueReservationUser.findMany({
      where: {
        venueId: venueId,
      },
    });
  }

  getByUser(userId: number) {
    return this.prismaService.venueReservationUser.findMany({
      where: {
        userId: userId,
      },
    });
  }

  delete(venueRatingUserId: number) {
    return this.prismaService.venueReservationUser.delete({
      where: {
        id: venueRatingUserId,
      },
    });
  }
}
