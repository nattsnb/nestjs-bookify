import { Test } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { PrismaService } from '../database/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';

describe('The ReservationService', () => {
  let reservationService: ReservationService;
  let prismaMock: {
    reservation: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      delete: jest.Mock;
      update: jest.Mock;
    };
  };
  let reservationsArray: any;

  beforeEach(async () => {
    prismaMock = {
      reservation: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        ReservationService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    reservationService = module.get(ReservationService);
    reservationsArray = [
      {
        id: 1,
        venueId: 1,
        userId: 1,
        dateStart: new Date('2025-06-10'),
        dateEnd: new Date('2025-06-12'),
        isPendingRating: true,
      },
      {
        id: 2,
        venueId: 2,
        userId: 2,
        dateStart: new Date('2025-07-10'),
        dateEnd: new Date('2025-07-12'),
        isPendingRating: true,
      },
    ];
  });

  describe('when getAll is called', () => {
    it('should return all reservations if they exist', async () => {
      prismaMock.reservation.findMany.mockResolvedValue(reservationsArray);
      const result = await reservationService.getAll();
      expect(result).toEqual(reservationsArray);
    });
    it('should throw NotFoundException if no reservations exist', async () => {
      prismaMock.reservation.findMany.mockResolvedValue([]);
      await expect(reservationService.getAll()).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('when getOne is called', () => {
    it('should return the reservation if found', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue(reservationsArray[0]);
      const result = await reservationService.getOne(reservationsArray[0].id);
      expect(result).toEqual(reservationsArray[0]);
    });
    it('should throw NotFoundException if not found', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue(null);
      await expect(reservationService.getOne(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('when getByVenue is called', () => {
    it('should return reservations if found', async () => {
      prismaMock.reservation.findMany.mockResolvedValue([reservationsArray[0]]);
      const result = await reservationService.getByVenue(
        reservationsArray[0].venueId,
      );
      expect(result).toEqual([reservationsArray[0]]);
    });
    it('should throw NotFoundException if none found', async () => {
      prismaMock.reservation.findMany.mockResolvedValue([]);
      await expect(reservationService.getByVenue(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('when getByUser is called', () => {
    it('should return reservations if found', async () => {
      prismaMock.reservation.findMany.mockResolvedValue([reservationsArray[0]]);
      const result = await reservationService.getByUser(
        reservationsArray[0].userId,
      );
      expect(result).toEqual([reservationsArray[0]]);
    });
    it('should throw NotFoundException if none found', async () => {
      prismaMock.reservation.findMany.mockResolvedValue([]);
      await expect(reservationService.getByUser(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('when changeIsPendingRating is called', () => {
    it('should toggle isPendingRating and return updated reservation', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue(reservationsArray[0]);
      prismaMock.reservation.update.mockResolvedValue({
        ...reservationsArray[0],
        isPendingRating: false,
      });
      const result = await reservationService.changeIsPendingRating(
        reservationsArray[0].id,
      );
      expect(result.isPendingRating).toBe(false);
    });
    it('should throw NotFoundException if reservation not found', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue(null);
      await expect(
        reservationService.changeIsPendingRating(999),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('when create is called', () => {
    let createReservationData: CreateReservationDto;
    beforeEach(() => {
      createReservationData = {
        venueId: reservationsArray[0].venueId,
        dateStart: reservationsArray[0].dateStart,
        dateEnd: reservationsArray[0].dateEnd,
      };
    });
    describe('and venue is available', () => {
      beforeEach(() => {
        prismaMock.reservation.findMany.mockResolvedValue([]);
        prismaMock.reservation.create.mockResolvedValue(reservationsArray[0]);
      });
      it('should create the reservation', async () => {
        const result = await reservationService.create(
          createReservationData,
          reservationsArray[0].userId,
        );
        expect(result).toEqual(reservationsArray[0]);
      });
    });
    describe('and dates are already taken', () => {
      beforeEach(() => {
        prismaMock.reservation.findMany.mockResolvedValue([
          reservationsArray[0],
        ]);
      });
      it('should throw ConflictException', async () => {
        await expect(
          reservationService.create(
            createReservationData,
            reservationsArray[0].userId,
          ),
        ).rejects.toThrow(ConflictException);
      });
    });
    describe('and venue or user not found', () => {
      beforeEach(() => {
        prismaMock.reservation.findMany.mockResolvedValue([]);
        prismaMock.reservation.create.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('fail', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          });
        });
      });
      it('should throw NotFoundException', async () => {
        await expect(
          reservationService.create(
            createReservationData,
            reservationsArray[0].userId,
          ),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when delete is called', () => {
    describe('and reservation exists', () => {
      beforeEach(() => {
        prismaMock.reservation.delete.mockResolvedValue(reservationsArray[0]);
      });
      it('should return the deleted reservation', async () => {
        const result = await reservationService.delete(reservationsArray[0].id);
        expect(result).toEqual(reservationsArray[0]);
      });
    });
    describe('and reservation does not exist', () => {
      beforeEach(() => {
        prismaMock.reservation.delete.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('fail', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          });
        });
      });
      it('should throw NotFoundException', async () => {
        await expect(
          reservationService.delete(reservationsArray[0].id),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when checkAvailability is called', () => {
    it('should return available: false if conflict exists', async () => {
      prismaMock.reservation.findMany.mockResolvedValue([reservationsArray[0]]);
      const result = await reservationService.checkAvailability(
        reservationsArray[0].venueId,
        reservationsArray[0].dateStart,
        reservationsArray[0].dateEnd,
      );
      expect(result.available).toBe(false);
    });
    it('should return available: true if no conflicts found', async () => {
      prismaMock.reservation.findMany.mockResolvedValue([]);
      const result = await reservationService.checkAvailability(
        reservationsArray[0].venueId,
        reservationsArray[0].dateStart,
        reservationsArray[0].dateEnd,
      );
      expect(result.available).toBe(true);
    });
  });

  describe('when getOccupiedDates is called', () => {
    it('should return all occupied dates within each reservation period', async () => {
      prismaMock.reservation.findMany.mockResolvedValue([reservationsArray[0]]);
      const result = await reservationService.getOccupiedDates(
        reservationsArray[0].venueId,
      );
      expect(result).toEqual(['2025-06-10', '2025-06-11']);
    });
  });
});
