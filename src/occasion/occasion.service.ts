import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateOccasionDto } from './dto/create-occasion.dto';
import { UpdateOccasionDto } from './dto/update-occasion.dto';

@Injectable()
export class OccasionService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.occasion.findMany();
  }

  async create(createOccasionData: CreateOccasionDto) {
    const { name, amenities } = createOccasionData;

    return await this.prismaService.occasion.create({
      data: {
        name,
        amenities: amenities?.length
          ? { connect: amenities.map((id) => ({ id })) }
          : undefined,
      },
    });
  }

  getOne(occasionId: number) {
    return this.prismaService.occasion.findUnique({
      where: {
        id: occasionId,
      },
    });
  }

  update(occasionId: number, updateOccasionData: UpdateOccasionDto) {
    const { name, amenities } = updateOccasionData;

    return this.prismaService.occasion.update({
      where: { id: occasionId },
      data: {
        name,
        amenities: amenities?.length
          ? { set: amenities.map((id) => ({ id })) }
          : undefined,
      },
    });
  }

  delete(occasionId: number) {
    return this.prismaService.occasion.delete({
      where: {
        id: occasionId,
      },
    });
  }
}
