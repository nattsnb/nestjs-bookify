import { Test } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { PrismaService } from '../database/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';

describe('The ReservationService', () => {
  let reservationService: ReservationService;
  let findManyReservationMock: jest.Mock;
  let findUniqueReservationMock: jest.Mock;
  let createReservationMock: jest.Mock;
  let deleteReservationMock: jest.Mock;
  let updateReservationMock: jest.Mock;
  let reservationsArray: any[];

  beforeEach(async () => {
    jest.clearAllMocks();
    findManyReservationMock = jest.fn();
    findUniqueReservationMock = jest.fn();
    createReservationMock = jest.fn();
    deleteReservationMock = jest.fn();
    updateReservationMock = jest.fn();

    const prismaMock = {
      reservation: {
        findMany: findManyReservationMock,
        findUnique: findUniqueReservationMock,
        create: createReservationMock,
        delete: deleteReservationMock,
        update: updateReservationMock,
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
    describe('and reservations exist', () => {
      it('should return all reservations', async () => {
        findManyReservationMock.mockResolvedValue(reservationsArray);
        const result = await reservationService.getAll();
        expect(result).toEqual(reservationsArray);
      });
    });

    describe('and no reservations exist', () => {
      it('should return an empty array', async () => {
        findManyReservationMock.mockResolvedValue([]);
        const result = await reservationService.getAll();
        expect(result).toEqual([]);
      });
    });
  });

  describe('when getOne is called', () => {
    it('should return the reservation if found', async () => {
      findUniqueReservationMock.mockResolvedValue(reservationsArray[0]);
      const result = await reservationService.getOne(reservationsArray[0].id);
      expect(result).toEqual(reservationsArray[0]);
    });
    it('should throw NotFoundException if not found', async () => {
      findUniqueReservationMock.mockResolvedValue(null);
      await expect(reservationService.getOne(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('when getByVenue is called', () => {
    it('should return reservations if found', async () => {
      findManyReservationMock.mockResolvedValue([reservationsArray[0]]);
      const result = await reservationService.getByVenue(
        reservationsArray[0].venueId,
      );
      expect(result).toEqual([reservationsArray[0]]);
    });
    it('should throw NotFoundException if none found', async () => {
      findManyReservationMock.mockResolvedValue([]);
      await expect(reservationService.getByVenue(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('when getByUser is called', () => {
    it('should return reservations if found', async () => {
      findManyReservationMock.mockResolvedValue([reservationsArray[0]]);
      const result = await reservationService.getByUser(
        reservationsArray[0].userId,
      );
      expect(result).toEqual([reservationsArray[0]]);
    });
    it('should throw NotFoundException if none found', async () => {
      findManyReservationMock.mockResolvedValue([]);
      await expect(reservationService.getByUser(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('when changeIsPendingRating is called', () => {
    it('should toggle isPendingRating and return updated reservation', async () => {
      findUniqueReservationMock.mockResolvedValue(reservationsArray[0]);
      updateReservationMock.mockResolvedValue({
        ...reservationsArray[0],
        isPendingRating: false,
      });
      const result = await reservationService.changeIsPendingRating(
        reservationsArray[0].id,
      );
      expect(result.isPendingRating).toBe(false);
    });
    it('should throw NotFoundException if reservation not found', async () => {
      findUniqueReservationMock.mockResolvedValue(null);
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
      it('should create the reservation', async () => {
        findManyReservationMock.mockResolvedValue([]);
        createReservationMock.mockResolvedValue(reservationsArray[0]);
        const result = await reservationService.create(
          createReservationData,
          reservationsArray[0].userId,
        );
        expect(result).toEqual(reservationsArray[0]);
      });
    });
    describe('and dates are already taken', () => {
      it('should throw ConflictException', async () => {
        findManyReservationMock.mockResolvedValue([reservationsArray[0]]);
        await expect(
          reservationService.create(
            createReservationData,
            reservationsArray[0].userId,
          ),
        ).rejects.toThrow(ConflictException);
      });
    });
    describe('and venue or user not found', () => {
      it('should throw NotFoundException', async () => {
        findManyReservationMock.mockResolvedValue([]);
        createReservationMock.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('fail', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          });
        });
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
      it('should return the deleted reservation', async () => {
        deleteReservationMock.mockResolvedValue(reservationsArray[0]);
        const result = await reservationService.delete(reservationsArray[0].id);
        expect(result).toEqual(reservationsArray[0]);
      });
    });
    describe('and reservation does not exist', () => {
      it('should throw NotFoundException', async () => {
        deleteReservationMock.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('fail', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          });
        });
        await expect(
          reservationService.delete(reservationsArray[0].id),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when checkAvailability is called', () => {
    it('should return available: false if conflict exists', async () => {
      findManyReservationMock.mockResolvedValue([reservationsArray[0]]);
      const result = await reservationService.checkAvailability(
        reservationsArray[0].venueId,
        reservationsArray[0].dateStart,
        reservationsArray[0].dateEnd,
      );
      expect(result.available).toBe(false);
    });
    it('should return available: true if no conflicts found', async () => {
      findManyReservationMock.mockResolvedValue([]);
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
      findManyReservationMock.mockResolvedValue([reservationsArray[0]]);
      const result = await reservationService.getOccupiedDates(
        reservationsArray[0].venueId,
      );
      expect(result).toEqual(['2025-06-10', '2025-06-11']);
    });
  });
});
