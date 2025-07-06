import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';

@Injectable()
export class FavouriteService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const favourites = await this.prismaService.favourite.findMany();
    if (!favourites.length) {
      throw new NotFoundException('No favourite venues found');
    }
    return favourites;
  }

  async create(venueId: number, userId: number) {
    try {
      return await this.prismaService.favourite.create({
        data: {
          venue: { connect: { id: venueId } },
          user: { connect: { id: userId } },
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

  async getOne(venueFavouriteUserId: number) {
    const favourite = await this.prismaService.favourite.findUnique({
      where: {
        id: venueFavouriteUserId,
      },
    });

    if (!favourite) {
      throw new NotFoundException(
        `Favourite with ID ${venueFavouriteUserId} not found`,
      );
    }

    return favourite;
  }

  async getByVenue(venueId: number) {
    const favourites = await this.prismaService.favourite.findMany({
      where: { venueId },
    });

    if (!favourites.length) {
      throw new NotFoundException(
        `No favourites found for venue with ID ${venueId}`,
      );
    }

    return favourites;
  }

  async getByUser(userId: number) {
    const favourites = await this.prismaService.favourite.findMany({
      where: { userId },
    });

    if (!favourites.length) {
      throw new NotFoundException(
        `No favourites found for user with ID ${userId}`,
      );
    }

    return favourites;
  }

  async delete(venueFavouriteUserId: number) {
    try {
      return await this.prismaService.favourite.delete({
        where: {
          id: venueFavouriteUserId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException(
          `Favourite with ID ${venueFavouriteUserId} not found`,
        );
      }
      throw error;
    }
  }
}
