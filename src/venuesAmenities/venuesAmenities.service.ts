import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { VenuesAmenitiesDto } from './dto/venuesAmenities.dto';

@Injectable()
export class VenuesAmenitiesService {
  constructor(private readonly prismaService: PrismaService) {}

  get() {
    return this.prismaService.venuesAmenities.findFirst();
  }

  create(venuesAmenitiesData: VenuesAmenitiesDto) {
    return this.prismaService.venuesAmenities.create({
      data: venuesAmenitiesData,
    });
  }
}
