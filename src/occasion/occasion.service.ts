import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateOccasionDto } from './dto/create-occasion.dto';
import { UpdateOccasionDto } from './dto/update-occasion.dto';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';

@Injectable()
export class OccasionService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const occasions = await this.prismaService.occasion.findMany();
    if (!occasions.length) {
      throw new NotFoundException('No occasions found');
    }
    return occasions;
  }

  async create(createOccasionData: CreateOccasionDto) {
    const { name, amenities } = createOccasionData;

    try {
      return await this.prismaService.occasion.create({
        data: {
          name,
          amenities: { connect: amenities.map((id) => ({ id })) },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException('One or more amenities not found');
      }
      throw error;
    }
  }

  async getOne(occasionId: number) {
    const occasion = await this.prismaService.occasion.findUnique({
      where: {
        id: occasionId,
      },
    });

    if (!occasion) {
      throw new NotFoundException(`Occasion with ID ${occasionId} not found`);
    }

    return occasion;
  }

  async update(occasionId: number, updateOccasionData: UpdateOccasionDto) {
    const { name, amenities } = updateOccasionData;

    const updateData: any = {
      name,
    };

    if (amenities && amenities?.length > 0) {
      updateData.amenities = {
        set: amenities.map((id) => ({ id })),
      };
    }

    try {
      return await this.prismaService.occasion.update({
        where: { id: occasionId },
        data: updateData,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException('Occasion or amenities not found');
      }
      throw error;
    }
  }

  async delete(occasionId: number) {
    try {
      return await this.prismaService.occasion.delete({
        where: {
          id: occasionId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException(`Occasion with ID ${occasionId} not found`);
      }
      throw error;
    }
  }
}
