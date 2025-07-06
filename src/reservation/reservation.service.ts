import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';
import { UpdateAmenityDto } from '../amenity/dto/update-amenity.dto';

@Injectable()
export class ReservationService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const reservations = await this.prismaService.reservation.findMany();
    if (!reservations.length) {
      throw new NotFoundException('No reservations found');
    }
    return reservations;
  }

  async create(createReservationData: CreateReservationDto, userId: number) {
    const { venueId, ...reservationData } = createReservationData;

    try {
      return await this.prismaService.reservation.create({
        data: {
          venue: { connect: { id: venueId } },
          user: { connect: { id: userId } },
          isActive: true,
          ...reservationData,
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

  async getOne(reservationId: number) {
    const reservation = await this.prismaService.reservation.findUnique({
      where: {
        id: reservationId,
      },
    });

    if (!reservation) {
      throw new NotFoundException(
        `Reservation with ID ${reservationId} not found`,
      );
    }

    return reservation;
  }

  async getByVenue(venueId: number) {
    const reservations = await this.prismaService.reservation.findMany({
      where: {
        venueId,
      },
    });

    if (!reservations.length) {
      throw new NotFoundException(
        `No reservations found for venue with ID ${venueId}`,
      );
    }

    return reservations;
  }

  async getByUser(userId: number) {
    const reservations = await this.prismaService.reservation.findMany({
      where: {
        userId,
      },
    });

    if (!reservations.length) {
      throw new NotFoundException(
        `No reservations found for user with ID ${userId}`,
      );
    }

    return reservations;
  }

  async delete(reservationId: number) {
    try {
      return await this.prismaService.reservation.delete({
        where: {
          id: reservationId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException(
          `Reservation with ID ${reservationId} not found`,
        );
      }
      throw error;
    }
  }

  async changeIsActive(reservationId: number) {
    try {
      const reservation = await this.prismaService.reservation.findUnique({
        where: { id: reservationId },
      });
      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }
      return await this.prismaService.reservation.update({
        where: { id: reservationId },
        data: {
          isActive: !reservation.isActive,
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
}
