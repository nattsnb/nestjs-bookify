import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';
import * as dayjs from 'dayjs';

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
    const { venueId, dateStart, dateEnd, ...reservationData } =
      createReservationData;

    const availability = await this.checkAvailability(
      venueId,
      new Date(`${dateStart}T00:00:00.000Z`),
      new Date(`${dateEnd}T00:00:00.000Z`),
    );

    if (!availability.available) {
      throw new ConflictException('Selected dates are already reserved.');
    }

    try {
      return await this.prismaService.reservation.create({
        data: {
          venue: { connect: { id: venueId } },
          user: { connect: { id: userId } },
          dateStart: new Date(`${dateStart}T00:00:00.000Z`),
          dateEnd: new Date(`${dateEnd}T00:00:00.000Z`),
          isPendingRating: true,
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
      where: { id: reservationId },
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
      where: { venueId },
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
      where: { userId },
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
        where: { id: reservationId },
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

  async changeIsPendingRating(reservationId: number) {
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
          isPendingRating: !reservation.isPendingRating,
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

  async checkAvailability(venueId: number, dateStart: Date, dateEnd: Date) {
    const conflicts = await this.prismaService.reservation.findMany({
      where: {
        venueId,
        isPendingRating: true,
        dateStart: { lt: dateEnd },
        dateEnd: { gt: dateStart },
      },
    });

    return { available: conflicts.length === 0 };
  }

  async getOccupiedDates(venueId: number) {
    const reservations = await this.prismaService.reservation.findMany({
      where: {
        venueId,
        isPendingRating: true,
      },
      select: {
        dateStart: true,
        dateEnd: true,
      },
    });

    const occupied: string[] = [];

    for (const reservation of reservations) {
      let current = dayjs(reservation.dateStart);
      const end = dayjs(reservation.dateEnd);

      while (current.isBefore(end, 'day')) {
        const dateAsString = current.format('YYYY-MM-DD');
        if (!occupied.includes(dateAsString)) {
          occupied.push(dateAsString);
        }
        current = current.add(1, 'day');
      }
    }

    return occupied.sort();
  }
}
