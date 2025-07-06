import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';

@Injectable()
export class RatingService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const ratings = await this.prismaService.rating.findMany();
    if (!ratings.length) {
      throw new NotFoundException('No ratings found');
    }
    return ratings;
  }

  async create(createRatingData: CreateRatingDto) {
    const { reservationId, ...venueRatingUserData } = createRatingData;

    try {
      return await this.prismaService.rating.create({
        data: {
          reservation: { connect: { id: reservationId } },
          ...venueRatingUserData,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException('Reservation not found');
      }
      throw error;
    }
  }

  async getOne(ratingId: number) {
    const rating = await this.prismaService.rating.findUnique({
      where: {
        id: ratingId,
      },
    });

    if (!rating) {
      throw new NotFoundException(`Rating with ID ${ratingId} not found`);
    }

    return rating;
  }

  async getByVenue(venueId: number) {
    const ratings = await this.prismaService.rating.findMany({
      where: {
        reservation: {
          venueId: venueId,
        },
      },
    });

    if (!ratings.length) {
      throw new NotFoundException(
        `No ratings found for venue with ID ${venueId}`,
      );
    }

    return ratings;
  }

  async getByUser(userId: number) {
    const ratings = await this.prismaService.rating.findMany({
      where: {
        reservation: {
          userId: userId,
        },
      },
    });

    if (!ratings.length) {
      throw new NotFoundException(
        `No ratings found for user with ID ${userId}`,
      );
    }

    return ratings;
  }

  async delete(ratingId: number) {
    try {
      return await this.prismaService.rating.delete({
        where: {
          id: ratingId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException(`Rating with ID ${ratingId} not found`);
      }
      throw error;
    }
  }
}
