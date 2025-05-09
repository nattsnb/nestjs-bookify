import { AmenityService } from './amenity.service';
import { Amenity, Prisma } from '@prisma/client';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { PrismaError } from '../database/prisma-error.enum';

describe('The AmenityService', () => {
  let amenityService: AmenityService;
  let findManyMock : jest.Mock;
  let createMock : jest.Mock;
  let findUniqueMock : jest.Mock;
  let updateMock : jest.Mock;
  let deleteMock : jest.Mock;
  let amenity: Amenity;
  beforeAll(async () => {
    findManyMock = jest.fn();
    createMock = jest.fn();
    findUniqueMock = jest.fn();
    updateMock = jest.fn();
    deleteMock = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        AmenityService,
        {
          provide: PrismaService,
          useValue: {
            amenity: {
              findMany: findManyMock,
              create: createMock,
              findUnique: findUniqueMock,
              update: updateMock,
              delete: deleteMock,
            }
          }
        }
      ]
    }).compile();
    amenityService = module.get(AmenityService);

    amenity = {
      id: 1;
      name: 'swimming pool';
      categoryId: 1;
    }
    findUniqueMock.mockResolvedValue(amenity);
  });
  describe('when the getAll function is called', () => {
    describe('and the findUnique method returns the amenity', () => {
      it('should return the amenity', async () => {
        const result = await amenityService.getAll();
        expect(result).toBe(amenity);
      });
    });
    describe('and the findUnique method does not return the amenities', () => {
      beforeEach(() => {
        findUniqueMock.mockResolvedValue([])
      })
      it('should throw the NotFoundException', async () => {
        return expect(async () => {
          await amenityService.getAll();
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when the create function is called with valid data', () => {
    let amenityData: CreateAmenityDto;
    beforeEach(() => {
      amenityData = {
        name: amenity.name,
        categoryId: amenity.categoryId,
      }
    });
    describe('and the prismaService.create returns a valid amenity', () => {
      beforeEach(() => {
        createMock.mockResolvedValue(amenity);
      });
      it('should return the created amenity', async () => {
        const result = await amenityService.create(amenityData);
        expect(result).toBe(amenity);
      });
    });
    describe('and the prisma.create causes the RecordDoesNotExist error', () => {
      beforeEach(() => {
        createMock.mockResolvedValue(
          new Prisma.PrismaClientKnownRequestError('Category not found', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          }),
        );
      });
      it('should throw the NotFoundException error', () => {
        return expect(async () => {
          await amenityService.create(amenityData);
        }).rejects.toThrow(NotFoundException);
      })
    })
  });
});