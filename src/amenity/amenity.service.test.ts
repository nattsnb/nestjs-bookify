import { Test } from '@nestjs/testing';
import { AmenityService } from './amenity.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { Amenity, Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';

describe('The AmenityService', () => {
  let amenityService: AmenityService;
  let findUniqueMock: jest.Mock;
  let findManyMock: jest.Mock;
  let createMock: jest.Mock;
  let updateMock: jest.Mock;
  let deleteMock: jest.Mock;
  let amenitiesArray: Amenity[];

  beforeEach(async () => {
    findUniqueMock = jest.fn();
    findManyMock = jest.fn();
    createMock = jest.fn();
    updateMock = jest.fn();
    deleteMock = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        AmenityService,
        {
          provide: PrismaService,
          useValue: {
            amenity: {
              findUnique: findUniqueMock,
              findMany: findManyMock,
              create: createMock,
              update: updateMock,
              delete: deleteMock,
            },
          },
        },
      ],
    }).compile();

    amenityService = module.get(AmenityService);
    amenitiesArray = [
      { id: 1, name: 'WiFi', categoryId: 1 },
      { id: 2, name: 'Swimming Pool', categoryId: 1 },
      { id: 3, name: 'Air Conditioning', categoryId: 2 },
    ];
  });

  describe('when the getAll function is called', () => {
    describe('and amenities exist', () => {
      beforeEach(() => {
        findManyMock.mockResolvedValue(amenitiesArray);
      });
      it('should return the list of amenities', async () => {
        const result = await amenityService.getAll();
        expect(result).toEqual(amenitiesArray);
      });
    });
    describe('and no amenities exist', () => {
      beforeEach(() => {
        findManyMock.mockResolvedValue([]);
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await amenityService.getAll();
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when the getOne function is called', () => {
    describe('and amenity with given ID exists', () => {
      beforeEach(() => {
        findUniqueMock.mockResolvedValue(amenitiesArray[0]);
      });
      it('should return the amenity', async () => {
        const result = await amenityService.getOne(amenitiesArray[0].id);
        expect(result).toBe(amenitiesArray[0]);
      });
    });
    describe('and amenity with given ID does not exist', () => {
      beforeEach(() => {
        findUniqueMock.mockResolvedValue(null);
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await amenityService.getOne(amenitiesArray[0].id);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when the create function is called', () => {
    let createData: CreateAmenityDto;
    beforeEach(() => {
      createData = {
        name: amenitiesArray[0].name,
        categoryId: amenitiesArray[0].categoryId,
      };
    });
    describe('and the create method returns the amenity', () => {
      beforeEach(() => {
        createMock.mockResolvedValue(amenitiesArray[0]);
      });
      it('should return the created amenity', async () => {
        const result = await amenityService.create(createData);
        expect(result).toEqual(amenitiesArray[0]);
      });
    });
    describe('and the category does not exist', () => {
      beforeEach(() => {
        createMock.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('Not found', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          });
        });
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await amenityService.create(createData);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when the update function is called', () => {
    let updateData: UpdateAmenityDto;
    const newName = 'New Product Name';
    beforeEach(() => {
      updateData = {
        name: newName,
      };
    });
    describe('and amenity with given id exists', () => {
      let updateResult: Amenity;
      beforeEach(() => {
        updateResult = {
          id: amenitiesArray[0].id,
          name: newName,
          categoryId: amenitiesArray[0].categoryId,
        };
        updateMock.mockResolvedValue(updateResult);
      });
      it('should return the updated amenity', async () => {
        const result = await amenityService.update(
          amenitiesArray[0].id,
          updateData,
        );
        expect(result).toEqual(updateResult);
      });
    });

    describe('and amenity or category does not exist', () => {
      beforeEach(() => {
        updateMock.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('Not found', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          });
        });
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await amenityService.update(amenitiesArray[0].id, updateData);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when the delete function is called', () => {
    describe('and amenity exists', () => {
      beforeEach(() => {
        deleteMock.mockResolvedValue(amenitiesArray[0]);
      });
      it('should return the deleted amenity', async () => {
        const result = await amenityService.delete(amenitiesArray[0].id);
        expect(result).toBe(amenitiesArray[0]);
      });
    });

    describe('and amenity does not exist', () => {
      beforeEach(() => {
        deleteMock.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('Not found', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          });
        });
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await amenityService.delete(amenitiesArray[0].id);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });
});
