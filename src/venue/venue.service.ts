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
        amenityToVenues: { include: { amenity: true } },
      },
    });

    return venues.map((venue) => ({
      ...venue,
      amenities: venue.amenityToVenues.map((venue) => venue.amenity),
    }));
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
        },
      });
      if (amenitiesIds?.length) {
        await this.prismaService.amenityToVenue.createMany({
          data: amenitiesIds.map((amenityId) => ({
            venueId: newVenue.id,
            amenityId,
          })),
          skipDuplicates: true,
        });
      }
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
        amenityToVenues: { include: { amenity: true } },
      },
    });

    if (!venue) {
      throw new NotFoundException(`Venue with ID ${venueId} not found`);
    }

    return {
      ...venue,
      amenities: venue.amenityToVenues.map((venue) => venue.amenity),
    };
  }

  async update(venueId: number, updateVenueData: UpdateVenueDto) {
    const { amenitiesIds, ...venueData } = updateVenueData;
    try {
      const updatedVenue = await this.prismaService.venue.update({
        where: { id: venueId },
        data: venueData,
      });
      if (amenitiesIds) {
        await this.prismaService.amenityToVenue.deleteMany({
          where: { venueId },
        });
        if (amenitiesIds.length > 0) {
          await this.prismaService.amenityToVenue.createMany({
            data: amenitiesIds.map((amenityId) => ({
              venueId,
              amenityId,
            })),
            skipDuplicates: true,
          });
        }
      }
      return updatedVenue;
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

  async filterByAmenity(amenityIds: number[]) {
    const matchedVenueIds = await this.prismaService.amenityToVenue.groupBy({
      by: ['venueId'],
      where: {
        amenityId: { in: amenityIds },
      },
      having: {
        amenityId: {
          _count: {
            equals: amenityIds.length,
          },
        },
      },
    });
    const venueIds = matchedVenueIds.map((item) => item.venueId);
    if (venueIds.length === 0) {
      throw new NotFoundException(`No venues found matching all amenities`);
    }
    return this.prismaService.venue.findMany({
      where: {
        id: { in: venueIds },
      },
      include: {
        reservations: true,
        favourites: true,
      },
    });
  }

  async filterCombined(amenityIds: number[], occasionIds: number[]) {
    let allAmenityIds = [...amenityIds];

    if (occasionIds.length > 0) {
      const occasions = await this.prismaService.occasion.findMany({
        where: { id: { in: occasionIds } },
        include: { amenities: true },
      });

      if (occasions.length === 0) {
        throw new NotFoundException(
          `No occasions found for IDs: [${occasionIds.join(', ')}]`,
        );
      }

      const occasionAmenityIds = occasions
        .flatMap((occasion) => occasion.amenities.map((amenity) => amenity.id))
        .filter((value, index, self) => self.indexOf(value) === index);

      allAmenityIds = [...new Set([...allAmenityIds, ...occasionAmenityIds])];
    }

    return this.filterByAmenity(allAmenityIds);
  }
}
