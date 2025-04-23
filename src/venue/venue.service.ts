import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';

@Injectable()
export class VenueService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.venue.findMany({
      include: {
        owner: true,
        amenities: true,
      },
    });
  }

  async create(createVenueData: CreateVenueDto) {
    const { amenitiesIds, ownerId, ...venueData } = createVenueData;

    return await this.prismaService.venue.create({
      data: {
        ...venueData,
        owner: { connect: { id: ownerId } },
        amenities: amenitiesIds?.length
          ? { connect: amenitiesIds.map((id) => ({ id })) }
          : undefined,
      },
    });
  }

  getOne(venueId: number) {
    return this.prismaService.venue.findUnique({
      where: {
        id: venueId,
      },
      include: {
        owner: true,
        amenities: true,
      },
    });
  }

  update(venueId: number, updateVenueData: UpdateVenueDto) {
    const { amenitiesIds, ...venueData } = updateVenueData;

    return this.prismaService.venue.update({
      where: { id: venueId },
      data: {
        ...venueData,
        ...(amenitiesIds?.length && {
          amenities: {
            set: amenitiesIds.map((id) => ({ id })),
          },
        }),
      },
    });
  }

  delete(venueId: number) {
    return this.prismaService.venue.delete({
      where: {
        id: venueId,
      },
    });
  }
}
