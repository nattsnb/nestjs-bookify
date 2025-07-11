import { Test } from '@nestjs/testing';
import { VenueTypeService } from './venue-type.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';

describe('The VenueTypeService', () => {
  let venueTypeService: VenueTypeService;
  let getAllVenueTypesMock: jest.Mock;
  let getOneVenueTypeMock: jest.Mock;
  let createVenueTypeMock: jest.Mock;
  let deleteVenueTypeMock: jest.Mock;

  const venueTypesArray = [
    { id: 1, name: 'Apartment' },
    { id: 2, name: 'Cabin' },
  ];

  beforeEach(async () => {
    getAllVenueTypesMock = jest.fn();
    getOneVenueTypeMock = jest.fn();
    createVenueTypeMock = jest.fn();
    deleteVenueTypeMock = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        VenueTypeService,
        {
          provide: PrismaService,
          useValue: {
            venueType: {
              findMany: getAllVenueTypesMock,
              findUnique: getOneVenueTypeMock,
              create: createVenueTypeMock,
              delete: deleteVenueTypeMock,
            },
          },
        },
      ],
    }).compile();

    venueTypeService = module.get(VenueTypeService);
  });

  describe('when getAll is called', () => {
    it('should return all venue types', async () => {
      getAllVenueTypesMock.mockResolvedValue(venueTypesArray);
      const result = await venueTypeService.getAll();
      expect(result).toEqual(venueTypesArray);
    });

    it('should return an empty array', async () => {
      getAllVenueTypesMock.mockResolvedValue([]);
      const result = await venueTypeService.getAll();
      expect(result).toEqual([]);
    });
  });

  describe('when getOne is called', () => {
    it('should return the venue type', async () => {
      getOneVenueTypeMock.mockResolvedValue(venueTypesArray[0]);
      const result = await venueTypeService.getOne(1);
      expect(result).toEqual(venueTypesArray[0]);
    });

    it('should throw NotFoundException if not found', async () => {
      getOneVenueTypeMock.mockResolvedValue(null);
      await expect(venueTypeService.getOne(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('when create is called', () => {
    it('should return the created venue type', async () => {
      createVenueTypeMock.mockResolvedValue(venueTypesArray[0]);
      const result = await venueTypeService.create({ name: 'Apartment' });
      expect(result).toEqual(venueTypesArray[0]);
    });

    it('should throw the error if creation fails', async () => {
      createVenueTypeMock.mockImplementation(() => {
        throw new Error('Unexpected error');
      });
      await expect(
        venueTypeService.create({ name: 'Apartment' }),
      ).rejects.toThrow('Unexpected error');
    });
  });

  describe('when delete is called', () => {
    it('should delete the venue type and return it', async () => {
      deleteVenueTypeMock.mockResolvedValue(venueTypesArray[0]);
      const result = await venueTypeService.delete(1);
      expect(result).toEqual(venueTypesArray[0]);
    });

    it('should throw NotFoundException if not found', async () => {
      deleteVenueTypeMock.mockImplementation(() => {
        throw new Prisma.PrismaClientKnownRequestError('Not found', {
          code: PrismaError.RecordDoesNotExist,
          clientVersion: '4.0.0',
        });
      });
      await expect(venueTypeService.delete(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw the error if unexpected error occurs', async () => {
      deleteVenueTypeMock.mockImplementation(() => {
        throw new Error('Unexpected error');
      });
      await expect(venueTypeService.delete(1)).rejects.toThrow(
        'Unexpected error',
      );
    });
  });
});
