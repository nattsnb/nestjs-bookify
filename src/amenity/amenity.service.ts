import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';

@Injectable()
export class AmenityService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const amenities = await this.prismaService.amenity.findMany();
    if (!amenities.length) {
      throw new NotFoundException('No amenities found');
    }
    return amenities;
  }

  async create(createAmenityData: CreateAmenityDto) {
    const { name, categoryId } = createAmenityData;

    try {
      return await this.prismaService.amenity.create({
        data: {
          name,
          category: {
            connect: { id: categoryId },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException('Category not found');
      }
      throw error;
    }
  }

  async getOne(amenityId: number) {
    const amenity = await this.prismaService.amenity.findUnique({
      where: {
        id: amenityId,
      },
    });

    if (!amenity) {
      throw new NotFoundException(`Amenity with ID ${amenityId} not found`);
    }

    return amenity;
  }

  async update(amenityId: number, updateAmenityData: UpdateAmenityDto) {
    const { name, categoryId } = updateAmenityData;

    try {
      return await this.prismaService.amenity.update({
        where: { id: amenityId },
        data: {
          name,
          category: {
            connect: { id: categoryId },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException('Amenity or category not found');
      }
      throw error;
    }
  }

  async delete(amenityId: number) {
    try {
      return await this.prismaService.amenity.delete({
        where: {
          id: amenityId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException(`Amenity with ID ${amenityId} not found`);
      }
      throw error;
    }
  }
}
