import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { PrismaError } from '../database/prisma-error.enum';
import { Prisma } from '@prisma/client';
import { VenueFilterDto } from './dto/venue-filter.dto';
import { UpdateVenueDetailsDto } from './dto/update-venue-details.dto';
import { UpdateVenueAmenitiesDto } from './dto/update-venue-amenities.dto';
import { UpdateVenueLocationDto } from './dto/update-venue-location.dto';
import { HttpService } from '@nestjs/axios';

type NominatimResult = { lat: string; lon: string }[];

@Injectable()
export class VenueService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  getAll() {
    return this.prismaService.venue.findMany({
      include: {
        owner: true,
        amenityToVenues: { include: { amenity: true } },
      },
    });
  }

  async getCityNames(): Promise<string[]> {
    const citiesData = await this.prismaService.venue.findMany({
      select: { city: true },
      distinct: ['city'],
      orderBy: { city: 'asc' },
    });
    const records = citiesData.map((record) => record.city.toLowerCase());
    const names = Array.from(new Set(records));
    names.sort();
    return names;
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
          reservations: { include: { rating: true } },
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

      const { streetNumber, streetName, postalCode, city } = dto;

      const coordinates = await this.geocodeAddress(
        streetNumber,
        streetName,
        postalCode,
        city,
      );

      return await this.prismaService.venue.update({
        where: { id: venueId },
        data: {
          streetNumber,
          streetName,
          postalCode,
          city,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateVenueAmenities(venueId: number, dto: UpdateVenueAmenitiesDto) {
    try {
      const existingVenue = await this.prismaService.venue.findUnique({
        where: { id: venueId },
      });
      if (!existingVenue) {
        throw new NotFoundException(`Venue with ID ${venueId} not found`);
      }

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

      return await this.prismaService.venue.findMany({
        where,
        include: {
          amenityToVenues: { include: { amenity: true } },
          reservations: true,
          favourites: true,
          venueType: true,
        },
      });
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

    try {
      const response = await this.httpService.axiosRef.get<NominatimResult>(
        url,
        {
          headers: { 'User-Agent': 'NestJS-App' },
        },
      );

      const data = response.data;

      if (!Array.isArray(data) || data.length === 0) {
        throw new NotFoundException('Geocoding failed: address not found');
      }

      const { lat, lon } = data[0];
      return {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      };
    } catch (error) {
      throw new NotFoundException('Geocoding failed: get error');
    }
  }
}
