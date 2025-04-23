import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateVenueRatingUserDto } from './dto/create-venue-rating-user.dto';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';

@Injectable()
export class VenueRatingUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const ratings = await this.prismaService.venueRatingUser.findMany();
    if (!ratings.length) {
      throw new NotFoundException('No ratings found');
    }
    return ratings;
  }

  async create(
    createVenueRatingUserData: CreateVenueRatingUserDto,
    userId: number,
  ) {
    const { venueId, ...venueRatingUserData } = createVenueRatingUserData;

    try {
      return await this.prismaService.venueRatingUser.create({
        data: {
          venue: { connect: { id: venueId } },
          user: { connect: { id: userId } },
          ...venueRatingUserData,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException('Venue or user not found');
      }
      throw error;
    }
  }

  async getOne(venueRatingUserId: number) {
    const rating = await this.prismaService.venueRatingUser.findUnique({
      where: {
        id: venueRatingUserId,
      },
    });

    if (!rating) {
      throw new NotFoundException(
        `Rating with ID ${venueRatingUserId} not found`,
      );
    }

    return rating;
  }

  async getByVenue(venueId: number) {
    const ratings = await this.prismaService.venueRatingUser.findMany({
      where: { venueId },
    });

    if (!ratings.length) {
      throw new NotFoundException(
        `No ratings found for venue with ID ${venueId}`,
      );
    }

    return ratings;
  }

  async getByUser(userId: number) {
    const ratings = await this.prismaService.venueRatingUser.findMany({
      where: { userId },
    });

    if (!ratings.length) {
      throw new NotFoundException(
        `No ratings found for user with ID ${userId}`,
      );
    }

    return ratings;
  }

  async delete(venueRatingUserId: number) {
    try {
      return await this.prismaService.venueRatingUser.delete({
        where: {
          id: venueRatingUserId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException(
          `Rating with ID ${venueRatingUserId} not found`,
        );
      }
      throw error;
    }
  }
}
