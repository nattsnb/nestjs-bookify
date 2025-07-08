import { Test } from '@nestjs/testing';
import { RatingService } from './rating.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma, Rating } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';
import { CreateRatingDto } from './dto/create-rating.dto';

describe('The RatingService', () => {
  let ratingService: RatingService;
  let findManyRaitingMock: jest.Mock;
  let findUniqueRaitingMock: jest.Mock;
  let createRaitingMock: jest.Mock;
  let deleteRaitingMock: jest.Mock;
  let ratingsArray: Rating[];

  beforeEach(async () => {
    jest.clearAllMocks();
    findManyRaitingMock = jest.fn();
    findUniqueRaitingMock = jest.fn();
    createRaitingMock = jest.fn();
    deleteRaitingMock = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        RatingService,
        {
          provide: PrismaService,
          useValue: {
            rating: {
              findMany: findManyRaitingMock,
              findUnique: findUniqueRaitingMock,
              create: createRaitingMock,
              delete: deleteRaitingMock,
            },
          },
        },
      ],
    }).compile();

    ratingService = module.get(RatingService);
    ratingsArray = [
      {
        id: 1,
        reservationId: 10,
        score: 4,
        review: 'Very good',
        createdAt: new Date('2024-01-01T10:00:00Z'),
      },
      {
        id: 2,
        reservationId: 11,
        score: 5,
        review: 'Excellent!',
        createdAt: new Date('2024-01-02T12:00:00Z'),
      },
    ];
  });

  describe('when getAll is called', () => {
    describe('and ratings exist', () => {
      beforeEach(() => {
        findManyRaitingMock.mockResolvedValue(ratingsArray);
      });
      it('should return all ratings', async () => {
        const result = await ratingService.getAll();
        expect(result).toEqual(ratingsArray);
      });
    });
    describe('and no ratings exist', () => {
      beforeEach(() => {
        findManyRaitingMock.mockResolvedValue([]);
      });
      it('should return an empty array', async () => {
        const result = await ratingService.getAll();
        expect(result).toEqual([]);
      });
    });
  });

  describe('when getOne is called', () => {
    describe('and rating exists', () => {
      beforeEach(() => {
        findUniqueRaitingMock.mockResolvedValue(ratingsArray[0]);
      });
      it('should return the rating', async () => {
        const result = await ratingService.getOne(ratingsArray[0].id);
        expect(result).toEqual(ratingsArray[0]);
      });
    });
    describe('and rating does not exist', () => {
      beforeEach(() => {
        findUniqueRaitingMock.mockResolvedValue(null);
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await ratingService.getOne(999);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when create is called', () => {
    let createData: CreateRatingDto;
    beforeEach(() => {
      createData = {
        reservationId: ratingsArray[0].reservationId,
        score: ratingsArray[0].score,
        review: ratingsArray[0].review ?? undefined,
      };
    });
    describe('and reservation exists', () => {
      beforeEach(() => {
        createRaitingMock.mockResolvedValue(ratingsArray[0]);
      });
      it('should call create with correct data', async () => {
        await ratingService.create(createData);
        expect(createRaitingMock).toHaveBeenCalledWith({
          data: {
            reservation: { connect: { id: createData.reservationId } },
            score: createData.score,
            review: createData.review,
          },
        });
      });
      it('should return the created rating', async () => {
        const result = await ratingService.create(createData);
        expect(result).toEqual(ratingsArray[0]);
      });
    });
    describe('and reservation does not exist', () => {
      beforeEach(() => {
        createRaitingMock.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('Not found', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          });
        });
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await ratingService.create(createData);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when getByVenue is called', () => {
    describe('and ratings for venue exist', () => {
      beforeEach(() => {
        findManyRaitingMock.mockResolvedValue([ratingsArray[0]]);
      });
      it('should return ratings for given venue', async () => {
        const result = await ratingService.getByVenue(1);
        expect(result).toEqual([ratingsArray[0]]);
      });
    });
    describe('and no ratings found for venue', () => {
      beforeEach(() => {
        findManyRaitingMock.mockResolvedValue([]);
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await ratingService.getByVenue(1);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when getByUser is called', () => {
    describe('and ratings for user exist', () => {
      beforeEach(() => {
        findManyRaitingMock.mockResolvedValue([ratingsArray[1]]);
      });
      it('should return ratings for given user', async () => {
        const result = await ratingService.getByUser(1);
        expect(result).toEqual([ratingsArray[1]]);
      });
    });
    describe('and no ratings found for user', () => {
      beforeEach(() => {
        findManyRaitingMock.mockResolvedValue([]);
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await ratingService.getByUser(1);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when delete is called', () => {
    describe('and rating exists', () => {
      beforeEach(() => {
        deleteRaitingMock.mockResolvedValue(ratingsArray[0]);
      });
      it('should return the deleted rating', async () => {
        const result = await ratingService.delete(ratingsArray[0].id);
        expect(result).toEqual(ratingsArray[0]);
      });
    });
    describe('and rating does not exist', () => {
      beforeEach(() => {
        deleteRaitingMock.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('Not found', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          });
        });
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await ratingService.delete(999);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });
});
