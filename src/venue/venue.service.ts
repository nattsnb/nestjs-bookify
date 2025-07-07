import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { PrismaError } from '../database/prisma-error.enum';
import { Prisma } from '@prisma/client';
import { VenueFilterDto } from './dto/venue-filter.dto';
import { UpdateVenueDetailsDto } from './dto/update-venue-details.dto';
import { UpdateVenueAmenitiesDto } from './dto/update-venue-amenities.dto';
import { UpdateVenueLocationDto } from './dto/update-venue-location.dto';

@Injectable()
export class VenueService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    try {
      const venues = await this.prismaService.venue.findMany({
        include: {
          owner: true,
          amenityToVenues: { include: { amenity: true } },
        },
      });

      if (!venues.length) {
        throw new NotFoundException('No venues found');
      }

      return venues.map((venue) => ({
        ...venue,
      }));
    } catch (error) {
      throw error;
    }
  }

  async create(createVenueData: CreateVenueDto, userId: number) {
    const {
      amenitiesIds,
      facebookUrl,
      instagramUrl,
      twitterUrl,
      websiteUrl,
      streetNumber,
      streetName,
      postalCode,
      city,
      venueTypeId,
      ...venueData
    } = createVenueData;

    try {
      const coordinates = await this.geocodeAddress(
        streetNumber,
        streetName,
        postalCode,
        city,
      );
      const latitude = coordinates.latitude;
      const longitude = coordinates.longitude;

      const newVenue = await this.prismaService.venue.create({
        data: {
          ...venueData,
          streetNumber,
          streetName,
          postalCode,
          city,
          latitude,
          longitude,
          facebookUrl: facebookUrl ?? undefined,
          instagramUrl: instagramUrl ?? undefined,
          twitterUrl: twitterUrl ?? undefined,
          websiteUrl: websiteUrl ?? undefined,
          venueType: { connect: { id: venueTypeId } },
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
        throw new NotFoundException('Not found – check provided IDs');
      }
      throw error;
    }
  }

  async getOne(venueId: number) {
    try {
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
      };
    } catch (error) {
      throw error;
    }
  }

  async updateVenueLocation(venueId: number, dto: UpdateVenueLocationDto) {
    try {
      const existingVenue = await this.prismaService.venue.findUnique({
        where: { id: venueId },
      });
      if (!existingVenue) {
        throw new NotFoundException(`Venue with ID ${venueId} not found`);
      }

      const streetNumber = dto.streetNumber ?? existingVenue.streetNumber;
      const streetName = dto.streetName ?? existingVenue.streetName;
      const postalCode = dto.postalCode ?? existingVenue.postalCode;
      const city = dto.city ?? existingVenue.city;

      const shouldRecalculateLocation =
        dto.streetNumber !== undefined ||
        dto.streetName !== undefined ||
        dto.postalCode !== undefined ||
        dto.city !== undefined;

      let latitude: number | undefined;
      let longitude: number | undefined;

      if (shouldRecalculateLocation) {
        const coordinates = await this.geocodeAddress(
          streetNumber,
          streetName,
          postalCode,
          city,
        );
        latitude = coordinates.latitude;
        longitude = coordinates.longitude;
      }

      return await this.prismaService.venue.update({
        where: { id: venueId },
        data: {
          ...(dto.streetNumber !== undefined && {
            streetNumber: dto.streetNumber,
          }),
          ...(dto.streetName !== undefined && { streetName: dto.streetName }),
          ...(dto.postalCode !== undefined && { postalCode: dto.postalCode }),
          ...(dto.city !== undefined && { city: dto.city }),
          ...(latitude !== undefined && { latitude }),
          ...(longitude !== undefined && { longitude }),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateVenueAmenities(venueId: number, dto: UpdateVenueAmenitiesDto) {
    try {
      const { amenitiesIds } = dto;

      await this.prismaService.amenityToVenue.deleteMany({
        where: { venueId },
      });

      if (amenitiesIds && amenitiesIds.length > 0) {
        await this.prismaService.amenityToVenue.createMany({
          data: amenitiesIds.map((amenityId) => ({
            venueId,
            amenityId,
          })),
          skipDuplicates: true,
        });
      }

      return {
        venueId,
        amenities: amenitiesIds ?? [],
      };
    } catch (error) {
      throw error;
    }
  }

  async updateVenueDetails(venueId: number, dto: UpdateVenueDetailsDto) {
    try {
      const existingVenue = await this.prismaService.venue.findUnique({
        where: { id: venueId },
      });
      if (!existingVenue) {
        throw new NotFoundException(`Venue with ID ${venueId} not found`);
      }

      const dataToUpdate = Object.entries(dto).reduce(
        (acc, [key, value]) => {
          if (value !== undefined) acc[key] = value;
          return acc;
        },
        {} as Record<string, any>,
      );

      delete dataToUpdate.id;

      const updatedVenue = await this.prismaService.venue.update({
        where: { id: venueId },
        data: dataToUpdate,
      });

      return updatedVenue;
    } catch (error) {
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

  async findWithFilters(filters: VenueFilterDto) {
    try {
      const {
        amenities = [],
        occasions = [],
        venueTypeId,
        pricePerNightInEURCentMin,
        pricePerNightInEURCentMax,
        dateStart,
        dateEnd,
        guests,
        latitude,
        longitude,
        radiusKm,
      } = filters;

      const allAmenities = await this.getCombinedAmenities(
        amenities,
        occasions,
      );

      const where: Prisma.VenueWhereInput = {};

      if (allAmenities.length > 0) {
        where.AND = allAmenities.map((amenityId) => ({
          amenityToVenues: {
            some: { amenityId },
          },
        }));
      }

      if (venueTypeId != null) {
        where.venueTypeId = venueTypeId;
      }

      if (
        pricePerNightInEURCentMin != null ||
        pricePerNightInEURCentMax != null
      ) {
        where.pricePerNightInEURCent = {};
        if (pricePerNightInEURCentMin != null)
          where.pricePerNightInEURCent.gte = pricePerNightInEURCentMin;
        if (pricePerNightInEURCentMax != null)
          where.pricePerNightInEURCent.lte = pricePerNightInEURCentMax;
      }

      if (dateStart && dateEnd) {
        where.reservations = {
          none: {
            isPendingRating: true,
            dateStart: { lt: new Date(dateEnd) },
            dateEnd: { gt: new Date(dateStart) },
          },
        };
      }

      if (guests != null) {
        where.capacity = { gte: guests };
      }

      if (
        latitude != null &&
        longitude != null &&
        radiusKm != null &&
        !isNaN(latitude) &&
        !isNaN(longitude) &&
        !isNaN(radiusKm)
      ) {
        const lat = latitude;
        const lng = longitude;
        const kmInDegree = 111;
        const deltaLat = radiusKm / kmInDegree;
        const deltaLng =
          radiusKm / (kmInDegree * Math.cos((lat * Math.PI) / 180));

        where.latitude = {
          gte: lat - deltaLat,
          lte: lat + deltaLat,
        };
        where.longitude = {
          gte: lng - deltaLng,
          lte: lng + deltaLng,
        };
      }

      const venues = await this.prismaService.venue.findMany({
        where,
        include: {
          amenityToVenues: { include: { amenity: true } },
          reservations: true,
          favourites: true,
          venueType: true,
        },
      });

      return venues;
    } catch (error) {
      throw error;
    }
  }

  async getCombinedAmenities(amenities: number[], occasionIds: number[]) {
    try {
      const allAmenityIds = [...amenities];

      if (occasionIds.length > 0) {
        const fetchedOccasions = await this.prismaService.occasion.findMany({
          where: { id: { in: occasionIds } },
          include: { amenities: true },
        });

        if (fetchedOccasions.length > 0) {
          const occasionAmenityIds = fetchedOccasions.flatMap((occasion) =>
            occasion.amenities.map((amenity) => amenity.id),
          );
          allAmenityIds.push(...occasionAmenityIds);
        }
      }

      return Array.from(new Set(allAmenityIds));
    } catch (error) {
      throw error;
    }
  }

  private async geocodeAddress(
    streetNumber: string,
    streetName: string,
    postalCode: string,
    city: string,
  ): Promise<{ latitude: number; longitude: number }> {
    const query = `${streetNumber} ${streetName}, ${postalCode} ${city}`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

    let data;
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'NestJS-App' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      data = await response.json();
    } catch (error) {
      throw new NotFoundException('Geocoding failed: fetch error');
    }

    if (!Array.isArray(data) || data.length === 0) {
      throw new NotFoundException('Geocoding failed: address not found');
    }

    const { lat, lon } = data[0];
    return {
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
    };
  }
}
