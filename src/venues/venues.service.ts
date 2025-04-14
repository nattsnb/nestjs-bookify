import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateVenueDto } from './dto/create-venue.dto';

@Injectable()
export class VenuesService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.venue.findMany();
  }

  async create(createVenueData: CreateVenueDto) {
    const { location, venueDetails, ...venueData } = createVenueData;

    return await this.prismaService.venue.create({
      data: {
        ...venueData,
        location: {
          create: location,
        },
        venueDetails: {
          create: venueDetails,
        },
      },
    });
  }
}
