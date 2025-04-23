import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { connect } from 'rxjs';

@Injectable()
export class AmenityService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.amenity.findMany();
  }

  async create(createAmenityData: CreateAmenityDto) {
    const { name, categoryId } = createAmenityData;

    return await this.prismaService.amenity.create({
      data: {
        name,
        category: {
          connect: { id: categoryId },
        },
      },
    });
  }

  getOne(amenityId: number) {
    return this.prismaService.amenity.findUnique({
      where: {
        id: amenityId,
      },
    });
  }

  update(amenityId: number, updateAmenityData: UpdateAmenityDto) {
    const { name, categoryId } = updateAmenityData;
    return this.prismaService.amenity.update({
      where: { id: amenityId },
      data: {
        name,
        category: {
          connect: { id: categoryId },
        },
      },
    });
  }

  delete(amenityId: number) {
    return this.prismaService.amenity.delete({
      where: {
        id: amenityId,
      },
    });
  }
}
