import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class VenueFavouriteUserService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.venueFavouriteUser.findMany();
  }

  async create(venueId: number, userId: number) {
    return await this.prismaService.venueFavouriteUser.create({
      data: {
        venue: { connect: { id: venueId } },
        user: { connect: { id: userId } },
      },
    });
  }

  getOne(venueRatingUserId: number) {
    return this.prismaService.venueFavouriteUser.findUnique({
      where: {
        id: venueRatingUserId,
      },
    });
  }

  getByVenue(venueId: number) {
    return this.prismaService.venueFavouriteUser.findMany({
      where: {
        venueId: venueId,
      },
    });
  }

  getByUser(userId: number) {
    return this.prismaService.venueFavouriteUser.findMany({
      where: {
        userId: userId,
      },
    });
  }

  delete(venueRatingUserId: number) {
    return this.prismaService.venueFavouriteUser.delete({
      where: {
        id: venueRatingUserId,
      },
    });
  }
}
