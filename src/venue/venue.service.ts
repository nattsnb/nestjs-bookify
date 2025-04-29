import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { PrismaError } from '../database/prisma-error.enum';
import { Prisma } from '@prisma/client';

@Injectable()
export class VenueService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const venues = await this.prismaService.venue.findMany({
      include: {
        owner: true,
        amenities: true,
      },
    });
    if (!venues.length) {
      throw new NotFoundException('No venues found');
    }
    return venues;
  }

  async create(createVenueData: CreateVenueDto, userId: number) {
    const {
      amenitiesIds,
      facebookUrl,
      instagramUrl,
      twitterUrl,
      websiteUrl,
      ...venueData
    } = createVenueData;
    try {
      const newVenue = await this.prismaService.venue.create({
        data: {
          ...venueData,
          facebookUrl: facebookUrl ?? undefined,
          instagramUrl: instagramUrl ?? undefined,
          twitterUrl: twitterUrl ?? undefined,
          websiteUrl: websiteUrl ?? undefined,
          owner: { connect: { id: userId } },
          amenities: amenitiesIds?.length
            ? { connect: amenitiesIds.map((id) => ({ id })) }
            : undefined,
        },
      });
      return newVenue;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException(
          `Owner or amenity not found – check provided IDs`,
        );
      }
      throw error;
    }
  }

  async getOne(venueId: number) {
    const venue = await this.prismaService.venue.findUnique({
      where: { id: venueId },
      include: {
        owner: true,
        amenities: true,
      },
    });
    if (!venue) {
      throw new NotFoundException(`Venue with ID ${venueId} not found`);
    }
    return venue;
  }

  async update(venueId: number, updateVenueData: UpdateVenueDto) {
    const { amenitiesIds, ...venueData } = updateVenueData;
    try {
      return await this.prismaService.venue.update({
        where: { id: venueId },
        data: {
          ...venueData,
          ...(amenitiesIds?.length && {
            amenities: {
              set: amenitiesIds.map((id) => ({ id })) ?? [],
            },
          }),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException(`Venue with ID ${venueId} not found`);
      }
      throw error;
    }
  }

  async delete(venueId: number) {
    try {
      return await this.prismaService.venue.delete({
        where: {
          id: venueId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException(`Venue with ID ${venueId} not found`);
      }
      throw error;
    }
  }
}
