import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.category.findMany();
  }

  async create(createCategoryData: CreateCategoryDto) {
    const { name, amenities } = createCategoryData;

    return await this.prismaService.category.create({
      data: {
        name,
        amenities: amenities?.length
          ? { connect: amenities.map((id) => ({ id })) }
          : undefined,
      },
    });
  }

  getOne(categoryId: number) {
    return this.prismaService.category.findUnique({
      where: {
        id: categoryId,
      },
    });
  }

  update(categoryId: number, updateCategoryData: UpdateCategoryDto) {
    const { name, amenities } = updateCategoryData;

    return this.prismaService.category.update({
      where: { id: categoryId },
      data: {
        name,
        amenities: amenities?.length
          ? { set: amenities.map((id) => ({ id })) }
          : undefined,
      },
    });
  }

  delete(categoryId: number) {
    return this.prismaService.category.delete({
      where: {
        id: categoryId,
      },
    });
  }
}
