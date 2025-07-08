import { Test } from '@nestjs/testing';
import { FavouriteService } from './favourite.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma, Favourite } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';

describe('The FavouriteService', () => {
  let favouriteService: FavouriteService;
  let findManyFavouriteMock: jest.Mock;
  let findUniqueFavouriteMock: jest.Mock;
  let createFavouriteMock: jest.Mock;
  let deleteFavouriteMock: jest.Mock;
  let favouritesArray: Favourite[];
  beforeEach(async () => {
    jest.clearAllMocks();
    findManyFavouriteMock = jest.fn();
    findUniqueFavouriteMock = jest.fn();
    createFavouriteMock = jest.fn();
    deleteFavouriteMock = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        FavouriteService,
        {
          provide: PrismaService,
          useValue: {
            favourite: {
              findMany: findManyFavouriteMock,
              findUnique: findUniqueFavouriteMock,
              create: createFavouriteMock,
              delete: deleteFavouriteMock,
            },
          },
        },
      ],
    }).compile();

    favouriteService = module.get(FavouriteService);
    favouritesArray = [
      { id: 1, venueId: 100, userId: 10 },
      { id: 2, venueId: 100, userId: 11 },
    ];
  });

  describe('when getAll is called', () => {
    describe('and favourites exist', () => {
      beforeEach(() => {
        findManyFavouriteMock.mockResolvedValue(favouritesArray);
      });
      it('should return all favourites', async () => {
        const result = await favouriteService.getAll();
        expect(result).toEqual(favouritesArray);
      });
    });
    describe('and no favourites exist', () => {
      beforeEach(() => {
        findManyFavouriteMock.mockResolvedValue([]);
      });
      it('should return an empty array', async () => {
        const result = await favouriteService.getAll();
        expect(result).toEqual([]);
      });
    });
  });
  describe('when getOne is called', () => {
    describe('and favourite exists', () => {
      beforeEach(() => {
        findUniqueFavouriteMock.mockResolvedValue(favouritesArray[0]);
      });
      it('should return the favourite', async () => {
        const result = await favouriteService.getOne(favouritesArray[0].id);
        expect(result).toEqual(favouritesArray[0]);
      });
    });
    describe('and favourite does not exist', () => {
      beforeEach(() => {
        findUniqueFavouriteMock.mockResolvedValue(null);
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await favouriteService.getOne(favouritesArray[0].id);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when create is called', () => {
    describe('and venue and user exist', () => {
      beforeEach(() => {
        createFavouriteMock.mockResolvedValue(favouritesArray[0]);
      });
      it('should return created favourite', async () => {
        const result = await favouriteService.create(
          favouritesArray[0].venueId,
          favouritesArray[0].userId,
        );
        expect(result).toEqual(favouritesArray[0]);
      });
    });
    describe('and venue or user does not exist', () => {
      beforeEach(() => {
        createFavouriteMock.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('Not found', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          });
        });
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await favouriteService.create(999, 888);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when getByVenue is called', () => {
    describe('and favourites exist for venue', () => {
      beforeEach(() => {
        findManyFavouriteMock.mockResolvedValue(favouritesArray);
      });
      it('should return favourites for venue', async () => {
        const result = await favouriteService.getByVenue(
          favouritesArray[0].venueId,
        );
        expect(result).toEqual(favouritesArray);
      });
    });
    describe('and no favourites exist for venue', () => {
      beforeEach(() => {
        findManyFavouriteMock.mockResolvedValue([]);
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await favouriteService.getByVenue(999);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when getByUser is called', () => {
    describe('and favourites exist for user', () => {
      beforeEach(() => {
        findManyFavouriteMock.mockResolvedValue([favouritesArray[0]]);
      });
      it('should return favourites for user', async () => {
        const result = await favouriteService.getByUser(
          favouritesArray[0].userId,
        );
        expect(result).toEqual([favouritesArray[0]]);
      });
    });
    describe('and no favourites exist for user', () => {
      beforeEach(() => {
        findManyFavouriteMock.mockResolvedValue([]);
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await favouriteService.getByUser(999);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when delete is called', () => {
    describe('and favourite exists', () => {
      beforeEach(() => {
        deleteFavouriteMock.mockResolvedValue(favouritesArray[0]);
      });
      it('should return the deleted favourite', async () => {
        const result = await favouriteService.delete(favouritesArray[0].id);
        expect(result).toEqual(favouritesArray[0]);
      });
    });
    describe('and favourite does not exist', () => {
      beforeEach(() => {
        deleteFavouriteMock.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('Not found', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          });
        });
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await favouriteService.delete(999);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });
});
