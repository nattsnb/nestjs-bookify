import { Test } from '@nestjs/testing';
import { VenueTypeService } from './venue-type.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';

describe('The VenueTypeService', () => {
  let venueTypeService: VenueTypeService;
  let prismaMock: any;

  const venueTypesArray = [
    { id: 1, name: 'Apartment' },
    { id: 2, name: 'Cabin' },
  ];

  beforeEach(async () => {
    prismaMock = {
      venueType: {
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        VenueTypeService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    venueTypeService = module.get(VenueTypeService);
  });

  describe('when getAll is called', () => {
    describe('and venue types exist', () => {
      beforeEach(() => {
        prismaMock.venueType.findMany.mockResolvedValue(venueTypesArray);
      });

      it('should return all venue types', async () => {
        const result = await venueTypeService.getAll();
        expect(result).toEqual(venueTypesArray);
      });
    });

    describe('and no venue types exist', () => {
      beforeEach(() => {
        prismaMock.venueType.findMany.mockResolvedValue([]);
      });

      it('should throw NotFoundException', async () => {
        await expect(venueTypeService.getAll()).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });

  describe('when getOne is called', () => {
    describe('and venue type exists', () => {
      beforeEach(() => {
        prismaMock.venueType.findUnique.mockResolvedValue(venueTypesArray[0]);
      });

      it('should return the venue type', async () => {
        const result = await venueTypeService.getOne(1);
        expect(result).toEqual(venueTypesArray[0]);
      });
    });

    describe('and venue type does not exist', () => {
      beforeEach(() => {
        prismaMock.venueType.findUnique.mockResolvedValue(null);
      });

      it('should throw NotFoundException', async () => {
        await expect(venueTypeService.getOne(999)).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });

  describe('when create is called', () => {
    describe('and creation succeeds', () => {
      beforeEach(() => {
        prismaMock.venueType.create.mockResolvedValue(venueTypesArray[0]);
      });

      it('should return the created venue type', async () => {
        const result = await venueTypeService.create({ name: 'Apartment' });
        expect(result).toEqual(venueTypesArray[0]);
      });
    });

    describe('and creation fails', () => {
      beforeEach(() => {
        prismaMock.venueType.create.mockImplementation(() => {
          throw new Error('Unexpected error');
        });
      });

      it('should throw the error', async () => {
        await expect(
          venueTypeService.create({ name: 'Apartment' }),
        ).rejects.toThrow('Unexpected error');
      });
    });
  });

  describe('when delete is called', () => {
    describe('and venue type exists', () => {
      beforeEach(() => {
        prismaMock.venueType.delete.mockResolvedValue(venueTypesArray[0]);
      });

      it('should delete the venue type and return it', async () => {
        const result = await venueTypeService.delete(1);
        expect(result).toEqual(venueTypesArray[0]);
      });
    });

    describe('and venue type does not exist', () => {
      beforeEach(() => {
        prismaMock.venueType.delete.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('Not found', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: '4.0.0',
          });
        });
      });

      it('should throw NotFoundException', async () => {
        await expect(venueTypeService.delete(999)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('and other error occurs during deletion', () => {
      beforeEach(() => {
        prismaMock.venueType.delete.mockImplementation(() => {
          throw new Error('Unexpected error');
        });
      });

      it('should throw the error', async () => {
        await expect(venueTypeService.delete(1)).rejects.toThrow(
          'Unexpected error',
        );
      });
    });
  });
});
