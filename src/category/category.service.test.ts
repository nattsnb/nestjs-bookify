import { Test } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma, Category, Amenity } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaError } from '../database/prisma-error.enum';
import { CategoryDto } from './dto/category.dto';

describe('The CategoryService', () => {
  let categoryService: CategoryService;
  let findManyMock: jest.Mock;
  let findUniqueMock: jest.Mock;
  let createMock: jest.Mock;
  let updateMock: jest.Mock;
  let deleteMock: jest.Mock;
  let categoriesArray: Category[];
  beforeEach(async () => {
    findManyMock = jest.fn();
    findUniqueMock = jest.fn();
    createMock = jest.fn();
    updateMock = jest.fn();
    deleteMock = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: PrismaService,
          useValue: {
            category: {
              findMany: findManyMock,
              findUnique: findUniqueMock,
              create: createMock,
              update: updateMock,
              delete: deleteMock,
            },
            amenity: {
              findUnique: findUniqueMock,
            },
          },
        },
      ],
    }).compile();

    categoryService = module.get(CategoryService);
    categoriesArray = [
      { id: 1, name: 'Amenities' },
      { id: 2, name: 'Handicap Accessibility' },
    ];
  });

  describe('when getAll is called', () => {
    describe('and categories exist', () => {
      beforeEach(() => {
        findManyMock.mockResolvedValue(categoriesArray);
      });
      it('should return the categories', async () => {
        const result = await categoryService.getAll();
        expect(result).toEqual(categoriesArray);
      });
    });
    describe('and no categories exist', () => {
      beforeEach(() => {
        findManyMock.mockResolvedValue([]);
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await categoryService.getAll();
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when getOne is called', () => {
    describe('and the category exists', () => {
      beforeEach(() => {
        findUniqueMock.mockResolvedValue(categoriesArray[0]);
      });
      it('should return the category', async () => {
        const result = await categoryService.getOne(categoriesArray[0].id);
        expect(result).toEqual(categoriesArray[0]);
      });
    });
    describe('and the category does not exist', () => {
      beforeEach(() => {
        findUniqueMock.mockResolvedValue(null);
      });
      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await categoryService.getOne(categoriesArray[0].id);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when create is called', () => {
    let createData: CreateCategoryDto;
    beforeEach(() => {
      createData = {
        name: categoriesArray[0].name,
        amenitiesIds: [1, 2],
      };
    });
    describe('and all amenities exist', () => {
      beforeEach(() => {
        findUniqueMock.mockResolvedValue({});
        createMock.mockResolvedValue(categoriesArray[0]);
      });
      it('should call create with correct amenities connect values', async () => {
        await categoryService.create(createData);
        expect(createMock).toHaveBeenCalledWith({
          data: {
            name: createData.name,
            amenities: {
              connect: [
                { id: createData.amenitiesIds![0] },
                { id: createData.amenitiesIds![1] },
              ],
            },
          },
        });
      });
      it('should create and return category', async () => {
        const result = await categoryService.create(createData);
        expect(result).toEqual(categoriesArray[0]);
      });
    });
    describe('and at least one of the amenities does not exist', () => {
      beforeEach(() => {
        findUniqueMock.mockImplementation(({ where }) => {
          if (where.id === createData.amenitiesIds![0]) return {};
          if (where.id === createData.amenitiesIds![1]) return null;
        });
      });
      it('should throw NotFoundException with specific message', async () => {
        return expect(async () => {
          await categoryService.create(createData);
        }).rejects.toThrow(
          `Invalid amenity IDs: ${createData.amenitiesIds![1]}`,
        );
      });
    });
  });

  describe('when update is called', () => {
    let updateData: UpdateCategoryDto;
    let updatedCategory: CategoryDto;
    const newName = 'New name';
    beforeEach(() => {
      updateData = {
        name: newName,
      };
      updatedCategory = {
        id: categoriesArray[0].id,
        name: newName,
      };
    });
    describe('and update succeeds', () => {
      beforeEach(() => {
        updateMock.mockResolvedValue(updatedCategory);
      });
      it('should return the updated category', async () => {
        const result = await categoryService.update(
          categoriesArray[0].id,
          updateData,
        );
        expect(result).toEqual(updatedCategory);
      });
    });
    describe('and update category or one of amenities does not exist', () => {
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
          await categoryService.update(categoriesArray[1].id, updateData);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when delete is called', () => {
    describe('and the category exists', () => {
      beforeEach(() => {
        deleteMock.mockResolvedValue(categoriesArray[0]);
      });
      it('should return the deleted category', async () => {
        const result = await categoryService.delete(categoriesArray[0].id);
        expect(result).toEqual(categoriesArray[0]);
      });
    });
    describe('and the category does not exist', () => {
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
          await categoryService.delete(categoriesArray[0].id);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });
});
