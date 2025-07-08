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
  let findUniqueAmenityMock: jest.Mock;
  let findManyAmenityMock: jest.Mock;
  let createAmenityMock: jest.Mock;
  let updateAmenityMock: jest.Mock;
  let deleteAmenityMock: jest.Mock;
  let amenitiesArray: Amenity[];

  beforeEach(async () => {
    findUniqueAmenityMock = jest.fn();
    findManyAmenityMock = jest.fn();
    createAmenityMock = jest.fn();
    updateAmenityMock = jest.fn();
    deleteAmenityMock = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        AmenityService,
        {
          provide: PrismaService,
          useValue: {
            amenity: {
              findUnique: findUniqueAmenityMock,
              findMany: findManyAmenityMock,
              create: createAmenityMock,
              update: updateAmenityMock,
              delete: deleteAmenityMock,
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
        findManyAmenityMock.mockResolvedValue(amenitiesArray);
      });
      it('should return the list of amenities', async () => {
        const result = await amenityService.getAll();
        expect(result).toEqual(amenitiesArray);
      });
    });
    describe('and no amenities exist', () => {
      beforeEach(() => {
        findManyAmenityMock.mockResolvedValue([]);
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
        findUniqueAmenityMock.mockResolvedValue(amenitiesArray[0]);
      });
      it('should return the amenity', async () => {
        const result = await amenityService.getOne(amenitiesArray[0].id);
        expect(result).toBe(amenitiesArray[0]);
      });
    });
    describe('and amenity with given ID does not exist', () => {
      beforeEach(() => {
        findUniqueAmenityMock.mockResolvedValue(null);
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
        createAmenityMock.mockResolvedValue(amenitiesArray[0]);
      });
      it('should return the created amenity', async () => {
        const result = await amenityService.create(createData);
        expect(result).toEqual(amenitiesArray[0]);
      });
    });
    describe('and the category does not exist', () => {
      beforeEach(() => {
        createAmenityMock.mockImplementation(() => {
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
        updateAmenityMock.mockResolvedValue(updateResult);
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
        updateAmenityMock.mockImplementation(() => {
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
        deleteAmenityMock.mockResolvedValue(amenitiesArray[0]);
      });
      it('should return the deleted amenity', async () => {
        const result = await amenityService.delete(amenitiesArray[0].id);
        expect(result).toBe(amenitiesArray[0]);
      });
    });

    describe('and amenity does not exist', () => {
      beforeEach(() => {
        deleteAmenityMock.mockImplementation(() => {
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
