import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateVenueRatingUserDto } from './dto/create-venue-rating-user.dto';

@Injectable()
export class VenueRatingUserService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.venueRatingUser.findMany();
  }

  async create(
    createVenueRatingUserData: CreateVenueRatingUserDto,
    userId: number,
  ) {
    const { venueId, ...venueRatingUserData } = createVenueRatingUserData;

    return await this.prismaService.venueRatingUser.create({
      data: {
        venue: { connect: { id: venueId } },
        user: { connect: { id: userId } },
        ...venueRatingUserData,
      },
    });
  }

  getOne(venueRatingUserId: number) {
    return this.prismaService.venueRatingUser.findUnique({
      where: {
        id: venueRatingUserId,
      },
    });
  }

  getByVenue(venueId: number) {
    return this.prismaService.venueRatingUser.findMany({
      where: {
        venueId: venueId,
      },
    });
  }

  getByUser(userId: number) {
    return this.prismaService.venueRatingUser.findMany({
      where: {
        userId: userId,
      },
    });
  }

  delete(venueRatingUserId: number) {
    return this.prismaService.venueRatingUser.delete({
      where: {
        id: venueRatingUserId,
      },
    });
  }
}
