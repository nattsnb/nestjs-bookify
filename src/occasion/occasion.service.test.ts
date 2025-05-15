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
  let findManyMock: jest.Mock;
  let findUniqueMock: jest.Mock;
  let createMock: jest.Mock;
  let updateMock: jest.Mock;
  let deleteMock: jest.Mock;
  let occasionsArray: Occasion[];
  beforeEach(async () => {
    findManyMock = jest.fn();
    findUniqueMock = jest.fn();
    createMock = jest.fn();
    updateMock = jest.fn();
    deleteMock = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        OccasionService,
        {
          provide: PrismaService,
          useValue: {
            occasion: {
              findMany: findManyMock,
              findUnique: findUniqueMock,
              create: createMock,
              update: updateMock,
              delete: deleteMock,
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
        findManyMock.mockResolvedValue(occasionsArray);
      });
      it('should return all occasions', async () => {
        const result = await occasionService.getAll();
        expect(result).toEqual(occasionsArray);
      });
    });
    describe('and no occasions exist', () => {
      beforeEach(() => {
        findManyMock.mockResolvedValue([]);
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
        findUniqueMock.mockResolvedValue(occasionsArray[0]);
      });
      it('should return the occasion', async () => {
        const result = await occasionService.getOne(occasionsArray[0].id);
        expect(result).toEqual(occasionsArray[0]);
      });
    });
    describe('and occasion does not exist', () => {
      beforeEach(() => {
        findUniqueMock.mockResolvedValue(null);
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
        createMock.mockResolvedValue(occasionsArray[0]);
      });
      it('should call create with correct amenities', async () => {
        await occasionService.create(createData);
        expect(createMock).toHaveBeenCalledWith({
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
        createMock.mockImplementation(() => {
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
        updateMock.mockResolvedValue({
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
        updateMock.mockImplementation(() => {
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
        deleteMock.mockResolvedValue(occasionsArray[0]);
      });
      it('should return deleted occasion', async () => {
        const result = await occasionService.delete(occasionsArray[0].id);
        expect(result).toEqual(occasionsArray[0]);
      });
    });
    describe('and occasion does not exist', () => {
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
          await occasionService.delete(999);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });
});
