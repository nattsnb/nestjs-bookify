import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const categories = await this.prismaService.category.findMany();
    if (!categories.length) {
      throw new NotFoundException('No categories found');
    }
    return categories;
  }

  async create(createCategoryData: CreateCategoryDto) {
    const { name, amenitiesIds } = createCategoryData;

    const invalidAmenityIds = [];

    if (amenitiesIds) {
      for (const id of amenitiesIds) {
        const amenity = await this.prismaService.amenity.findUnique({
          where: { id },
        });
        if (!amenity) invalidAmenityIds.push(id);
      }
    }
    if (invalidAmenityIds.length) {
      throw new NotFoundException(
        `Invalid amenity IDs: ${invalidAmenityIds.join(', ')}`,
      );
    }
    return this.prismaService.category.create({
      data: {
        name,
        amenities: amenitiesIds?.length
          ? { connect: amenitiesIds.map((id) => ({ id })) }
          : undefined,
      },
    });
  }

  async getOne(categoryId: number) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return category;
  }

  async update(categoryId: number, updateCategoryData: UpdateCategoryDto) {
    const { name, amenitiesIds } = updateCategoryData;

    try {
      return await this.prismaService.category.update({
        where: { id: categoryId },
        data: {
          name,
          amenities: amenitiesIds?.length
            ? { set: amenitiesIds.map((id) => ({ id })) }
            : undefined,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException('Category or amenities not found');
      }
      throw error;
    }
  }

  async delete(categoryId: number) {
    try {
      return await this.prismaService.category.delete({
        where: {
          id: categoryId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }
      throw error;
    }
  }
}
