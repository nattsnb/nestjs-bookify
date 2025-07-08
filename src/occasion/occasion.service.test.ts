import { Test } from '@nestjs/testing';
import { OccasionService } from './occasion.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma, Occasion } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';
import { CreateOccasionDto } from './dto/create-occasion.dto';
import { UpdateOccasionDto } from './dto/update-occasion.dto';

describe('The OccasionService', () => {
  let occasionService: OccasionService;
  let findOccasionManyMock: jest.Mock;
  let findOccasionUniqueMock: jest.Mock;
  let createOccasionMock: jest.Mock;
  let updateOccasionMock: jest.Mock;
  let deleteOccasionMock: jest.Mock;
  let occasionsArray: Occasion[];
  beforeEach(async () => {
    jest.clearAllMocks();
    findOccasionManyMock = jest.fn();
    findOccasionUniqueMock = jest.fn();
    createOccasionMock = jest.fn();
    updateOccasionMock = jest.fn();
    deleteOccasionMock = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        OccasionService,
        {
          provide: PrismaService,
          useValue: {
            occasion: {
              findMany: findOccasionManyMock,
              findUnique: findOccasionUniqueMock,
              create: createOccasionMock,
              update: updateOccasionMock,
              delete: deleteOccasionMock,
            },
          },
        },
      ],
    }).compile();

    occasionService = module.get(OccasionService);
    occasionsArray = [
      { id: 1, name: 'Birthday' },
      { id: 2, name: 'Wedding' },
    ];
  });

  describe('when getAll is called', () => {
    describe('and occasions exist', () => {
      beforeEach(() => {
        findOccasionManyMock.mockResolvedValue(occasionsArray);
      });
      it('should return all occasions', async () => {
        const result = await occasionService.getAll();
        expect(result).toEqual(occasionsArray);
      });
    });
    describe('and no occasions exist', () => {
      beforeEach(() => {
        findOccasionManyMock.mockResolvedValue([]);
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await occasionService.getAll();
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when getOne is called', () => {
    describe('and occasion exists', () => {
      beforeEach(() => {
        findOccasionUniqueMock.mockResolvedValue(occasionsArray[0]);
      });
      it('should return the occasion', async () => {
        const result = await occasionService.getOne(occasionsArray[0].id);
        expect(result).toEqual(occasionsArray[0]);
      });
    });
    describe('and occasion does not exist', () => {
      beforeEach(() => {
        findOccasionUniqueMock.mockResolvedValue(null);
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await occasionService.getOne(occasionsArray[0].id);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when create is called', () => {
    let createData: CreateOccasionDto;
    beforeEach(() => {
      createData = {
        name: occasionsArray[0].name,
        amenities: [1, 2],
      };
    });
    describe('and all amenities exist', () => {
      beforeEach(() => {
        createOccasionMock.mockResolvedValue(occasionsArray[0]);
      });
      it('should call create with correct amenities', async () => {
        await occasionService.create(createData);
        expect(createOccasionMock).toHaveBeenCalledWith({
          data: {
            name: createData.name,
            amenities: {
              connect: [
                { id: createData.amenities[0] },
                { id: createData.amenities[1] },
              ],
            },
          },
        });
      });
      it('should return created occasion', async () => {
        const result = await occasionService.create(createData);
        expect(result).toEqual(occasionsArray[0]);
      });
    });
    describe('and some amenities do not exist', () => {
      beforeEach(() => {
        createOccasionMock.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('Not found', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          });
        });
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await occasionService.create(createData);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when update is called', () => {
    let updateData: UpdateOccasionDto;
    const newName = 'Updated Occasion';
    beforeEach(() => {
      updateData = {
        name: newName,
        amenities: [1, 2],
      };
    });
    describe('and update succeeds', () => {
      beforeEach(() => {
        updateOccasionMock.mockResolvedValue({
          id: occasionsArray[0].id,
          name: newName,
        });
      });
      it('should return updated occasion', async () => {
        const result = await occasionService.update(
          occasionsArray[0].id,
          updateData,
        );
        expect(result).toEqual({
          id: occasionsArray[0].id,
          name: newName,
        });
      });
    });
    describe('and occasion or amenities do not exist', () => {
      beforeEach(() => {
        updateOccasionMock.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('Not found', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          });
        });
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await occasionService.update(99, updateData);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when delete is called', () => {
    describe('and occasion exists', () => {
      beforeEach(() => {
        deleteOccasionMock.mockResolvedValue(occasionsArray[0]);
      });
      it('should return deleted occasion', async () => {
        const result = await occasionService.delete(occasionsArray[0].id);
        expect(result).toEqual(occasionsArray[0]);
      });
    });
    describe('and occasion does not exist', () => {
      beforeEach(() => {
        deleteOccasionMock.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('Not found', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          });
        });
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await occasionService.delete(999);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });
});
