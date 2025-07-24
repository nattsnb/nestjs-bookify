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
      it('should return all occasions', async () => {
        findOccasionManyMock.mockResolvedValue(occasionsArray);
        const result = await occasionService.getAll();
        expect(result).toEqual(occasionsArray);
      });
    });
    describe('and no occasions exist', () => {
      it('should return an empty array', async () => {
        findOccasionManyMock.mockResolvedValue([]);
        const result = await occasionService.getAll();
        expect(result).toEqual([]);
      });
    });
  });

  describe('when getOne is called', () => {
    describe('and occasion exists', () => {
      it('should return the occasion', async () => {
        findOccasionUniqueMock.mockResolvedValue(occasionsArray[0]);
        const result = await occasionService.getOne(occasionsArray[0].id);
        expect(result).toEqual(occasionsArray[0]);
      });
    });
    describe('and occasion does not exist', () => {
      it('should throw NotFoundException', async () => {
        findOccasionUniqueMock.mockResolvedValue(null);
        await expect(
          occasionService.getOne(occasionsArray[0].id),
        ).rejects.toThrow(NotFoundException);
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
      it('should call create with correct amenities', async () => {
        createOccasionMock.mockResolvedValue(occasionsArray[0]);
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
        createOccasionMock.mockResolvedValue(occasionsArray[0]);
        const result = await occasionService.create(createData);
        expect(result).toEqual(occasionsArray[0]);
      });
    });
    describe('and some amenities do not exist', () => {
      it('should throw NotFoundException', async () => {
        createOccasionMock.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('Not found', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          });
        });
        await expect(occasionService.create(createData)).rejects.toThrow(
          NotFoundException,
        );
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
      it('should return updated occasion', async () => {
        updateOccasionMock.mockResolvedValue({
          id: occasionsArray[0].id,
          name: newName,
        });
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
      it('should throw NotFoundException', async () => {
        updateOccasionMock.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('Not found', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          });
        });
        await expect(occasionService.update(99, updateData)).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });

  describe('when delete is called', () => {
    describe('and occasion exists', () => {
      it('should return deleted occasion', async () => {
        deleteOccasionMock.mockResolvedValue(occasionsArray[0]);
        const result = await occasionService.delete(occasionsArray[0].id);
        expect(result).toEqual(occasionsArray[0]);
      });
    });
    describe('and occasion does not exist', () => {
      it('should throw NotFoundException', async () => {
        deleteOccasionMock.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('Not found', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          });
        });
        await expect(occasionService.delete(999)).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });
});
