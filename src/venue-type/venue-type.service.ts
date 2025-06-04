import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateVenueTypeDto } from './dto/create-venue-type.dto';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';

@Injectable()
export class VenueTypeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const types = await this.prismaService.venueType.findMany();
    if (!types.length) {
      throw new NotFoundException('No venue types found');
    }
    return types;
  }

  async create(createVenueTypeData: CreateVenueTypeDto) {
    try {
      return await this.prismaService.venueType.create({
        data: {
          name: createVenueTypeData.name,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(venueTypeId: number) {
    try {
      return await this.prismaService.venueType.delete({
        where: { id: venueTypeId },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException(
          `Venue type with ID ${venueTypeId} not found`,
        );
      }
      throw error;
    }
  }

  async getOne(venueTypeId: number) {
    const venueType = await this.prismaService.venueType.findUnique({
      where: { id: venueTypeId },
    });

    if (!venueType) {
      throw new NotFoundException(
        `Venue type with ID ${venueTypeId} not found`,
      );
    }

    return venueType;
  }
}
