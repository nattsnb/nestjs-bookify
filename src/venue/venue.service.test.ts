import { Test } from '@nestjs/testing';
import { VenueService } from './venue.service';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueLocationDto } from './dto/update-venue-location.dto';
import { VenueDto } from './dto/venue.dto';
import { HttpService } from '@nestjs/axios';
import { UpdateVenueAmenitiesDto } from './dto/update-venue-amenities.dto';
import { UpdateVenueDetailsDto } from './dto/update-venue-details.dto';
import { NotFoundException } from '@nestjs/common';

describe('The VenueService', () => {
  let venueService: VenueService;
  let prismaMock: any;
  let venuesArray: any[];
  let createVenueData: CreateVenueDto;

  beforeEach(async () => {
    prismaMock = {
      venue: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      amenityToVenue: {
        createMany: jest.fn(),
        deleteMany: jest.fn(),
        groupBy: jest.fn(),
      },
      occasion: {
        findMany: jest.fn(),
      },
    };

    const httpServiceMock = {
      axiosRef: {
        get: jest.fn(),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        VenueService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: HttpService, useValue: httpServiceMock },
      ],
    }).compile();

    venueService = module.get(VenueService);
    venuesArray = [
      {
        id: 1,
        name: 'Test Venue One',
        description: 'Nice place by the sea',
        images: ['https://example.com/venue1.jpg'],
        pricePerNightInEURCent: 15000,
        rating: 4.7,
        capacity: 5,
        amountsOfBeds: 3,
        extraSleepingDetails: 'Sofa bed for one',
        checkInHour: 15,
        checkOutHour: 11,
        distanceFromCityCenterInMeters: 700,
        facebookUrl: 'https://facebook.com/venue1',
        instagramUrl: 'https://instagram.com/venue1',
        twitterUrl: null,
        websiteUrl: 'https://venue1.com',
        streetNumber: '10B',
        streetName: 'Beach Ave',
        postalCode: '54321',
        city: 'Beachville',
        ownerId: 1,
        venueTypeId: 1,
        owner: {
          id: 1,
          name: 'Owner One',
          email: 'owner1@example.com',
          phoneNumber: '+48123456789',
        },
        amenityToVenues: [
          { amenity: { id: 1, name: 'WiFi' } },
          { amenity: { id: 2, name: 'Pool' } },
        ],
        amenities: [
          { id: 1, name: 'WiFi' },
          { id: 2, name: 'Pool' },
        ],
      },
      {
        id: 2,
        name: 'Test Venue Two',
        description: 'Cozy cabin in the woods',
        images: ['https://example.com/venue2.jpg'],
        pricePerNightInEURCent: 8000,
        rating: 4.2,
        capacity: 2,
        amountsOfBeds: 1,
        extraSleepingDetails: 'No extra beds',
        checkInHour: 16,
        checkOutHour: 10,
        distanceFromCityCenterInMeters: 3000,
        facebookUrl: null,
        instagramUrl: null,
        twitterUrl: null,
        websiteUrl: null,
        streetNumber: '77A',
        streetName: 'Forest Path',
        postalCode: '67890',
        city: 'Woodtown',
        ownerId: 2,
        venueTypeId: 2,
        owner: {
          id: 2,
          name: 'Owner Two',
          email: 'owner2@example.com',
          phoneNumber: '+48987654321',
        },
        amenityToVenues: [{ amenity: { id: 3, name: 'Fireplace' } }],
        amenities: [{ id: 3, name: 'Fireplace' }],
      },
    ];

    createVenueData = {
      name: venuesArray[0].name,
      description: venuesArray[0].description,
      images: venuesArray[0].images,
      pricePerNightInEURCent: venuesArray[0].pricePerNightInEURCent,
      rating: venuesArray[0].rating,
      capacity: venuesArray[0].capacity,
      amountsOfBeds: venuesArray[0].amountsOfBeds,
      extraSleepingDetails: venuesArray[0].extraSleepingDetails,
      checkInHour: venuesArray[0].checkInHour,
      checkOutHour: venuesArray[0].checkOutHour,
      distanceFromCityCenterInMeters:
        venuesArray[0].distanceFromCityCenterInMeters,
      facebookUrl: venuesArray[0].facebookUrl,
      instagramUrl: venuesArray[0].instagramUrl,
      twitterUrl: venuesArray[0].twitterUrl,
      websiteUrl: venuesArray[0].websiteUrl,
      streetNumber: venuesArray[0].streetNumber,
      streetName: venuesArray[0].streetName,
      postalCode: venuesArray[0].postalCode,
      city: venuesArray[0].city,
      amenitiesIds: [1, 2],
      venueTypeId: 1,
    };
  });

  describe('when getAll is called', () => {
    it('should return all venues with amenities included', async () => {
      prismaMock.venue.findMany.mockResolvedValue(venuesArray);
      const result = await venueService.getAll();
      expect(result).toEqual(venuesArray);
    });
    it('should return an empty array', async () => {
      prismaMock.venue.findMany.mockResolvedValue([]);
      const result = await venueService.getAll();
      expect(result).toEqual([]);
    });
  });

  describe('when getOne is called', () => {
    it('should return the venue if exists', async () => {
      prismaMock.venue.findUnique.mockResolvedValue(venuesArray[0]);
      const result = await venueService.getOne(venuesArray[0].id);
      expect(result).toEqual(venuesArray[0]);
    });
    it('should throw NotFoundException if not exists', async () => {
      prismaMock.venue.findUnique.mockResolvedValue(null);
      await expect(venueService.getOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('when create is called', () => {
    it('should create a venue and return it', async () => {
      jest.spyOn(venueService as any, 'geocodeAddress').mockResolvedValue({
        lat: 52.2297,
        lon: 21.0122,
      });
      prismaMock.venue.create.mockResolvedValue(venuesArray[0]);
      const result = await venueService.create(
        createVenueData,
        venuesArray[0].ownerId,
      );
      expect(result).toEqual(venuesArray[0]);
    });
    it('should throw NotFoundException if relation missing', async () => {
      prismaMock.venue.create.mockImplementation(() => {
        throw new Prisma.PrismaClientKnownRequestError('Not found', {
          code: PrismaError.RecordDoesNotExist,
          clientVersion: Prisma.prismaVersion.client,
        });
      });
      await expect(
        venueService.create(createVenueData, venuesArray[0].ownerId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('when updateVenueLocation is called', () => {
    let updateData: UpdateVenueLocationDto;
    let updatedVenue: VenueDto;
    const newStreetNumber = '123';
    const newStreetName = 'Updated Street Name';
    const newPostalCode = 'Updated Postal Code';
    const newCity = 'Updated City Name';
    const mockLatitude = 52.2297;
    const mockLongitude = 21.0122;
    beforeEach(() => {
      updateData = {
        streetNumber: newStreetNumber,
        streetName: newStreetName,
        postalCode: newPostalCode,
        city: newCity,
      };
      updatedVenue = {
        ...venuesArray[0],
        streetNumber: newStreetNumber,
        streetName: newStreetName,
        postalCode: newPostalCode,
        city: newCity,
        latitude: mockLatitude,
        longitude: mockLongitude,
      };
    });
    describe('and venue exists', () => {
      beforeEach(() => {
        prismaMock.venue.findUnique.mockResolvedValue(venuesArray[0]);
      });
      describe('and geocode works', () => {
        it('should update venue location and return updated venue', async () => {
          (venueService as any).geocodeAddress = jest.fn().mockResolvedValue({
            latitude: mockLatitude,
            longitude: mockLongitude,
          });
          prismaMock.venue.update.mockResolvedValue(updatedVenue);
          const result = await venueService.updateVenueLocation(
            venuesArray[0].id,
            updateData,
          );
          expect(result).toEqual(updatedVenue);
          expect((venueService as any).geocodeAddress).toHaveBeenCalledWith(
            newStreetNumber,
            newStreetName,
            newPostalCode,
            newCity,
          );
          expect(prismaMock.venue.update).toHaveBeenCalledWith({
            where: { id: venuesArray[0].id },
            data: {
              streetNumber: newStreetNumber,
              streetName: newStreetName,
              postalCode: newPostalCode,
              city: newCity,
              latitude: mockLatitude,
              longitude: mockLongitude,
            },
          });
        });
      });
      describe('and geocode fails', () => {
        it('should throw NotFoundException from geocodeAddress', async () => {
          (venueService as any).geocodeAddress = jest
            .fn()
            .mockRejectedValue(new NotFoundException('Geocoding failed'));
          await expect(
            venueService.updateVenueLocation(venuesArray[0].id, updateData),
          ).rejects.toThrow(NotFoundException);
        });
      });
    });
    describe('and venue does not exist', () => {
      it('should throw NotFoundException', async () => {
        prismaMock.venue.findUnique.mockResolvedValue(null);
        await expect(
          venueService.updateVenueLocation(999, updateData),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when updateVenueAmenities is called', () => {
    let updateAmenitiesDto: UpdateVenueAmenitiesDto;
    let venueId: number;
    const exampleAmenities = [1, 2, 3];
    beforeEach(() => {
      updateAmenitiesDto = { amenitiesIds: exampleAmenities };
      prismaMock.venue.findUnique.mockClear();
      prismaMock.amenityToVenue.deleteMany.mockClear();
      prismaMock.amenityToVenue.createMany.mockClear();
      venueId = venuesArray[0].id;
    });
    describe('and venue exists', () => {
      beforeEach(() => {
        prismaMock.venue.findUnique.mockResolvedValue(venuesArray[0]);
      });
      describe('and amenitiesIds is a non-empty array', () => {
        it('should remove all amenities and add new ones', async () => {
          prismaMock.amenityToVenue.deleteMany.mockResolvedValue({ count: 3 });
          prismaMock.amenityToVenue.createMany.mockResolvedValue({ count: 3 });
          const result = await venueService.updateVenueAmenities(
            venueId,
            updateAmenitiesDto,
          );
          expect(prismaMock.venue.findUnique).toHaveBeenCalledWith({
            where: { id: venueId },
          });
          expect(prismaMock.amenityToVenue.deleteMany).toHaveBeenCalledWith({
            where: { venueId },
          });
          expect(prismaMock.amenityToVenue.createMany).toHaveBeenCalledWith({
            data: exampleAmenities.map((id) => ({ venueId, amenityId: id })),
            skipDuplicates: true,
          });
          expect(result).toEqual({
            venueId,
            amenities: exampleAmenities,
          });
        });
      });
      describe('and amenitiesIds is an empty array', () => {
        it('should remove all amenities and return venueId with empty array', async () => {
          prismaMock.amenityToVenue.deleteMany.mockResolvedValue({ count: 3 });
          const dto = { amenitiesIds: [] };
          const result = await venueService.updateVenueAmenities(venueId, dto);
          expect(prismaMock.venue.findUnique).toHaveBeenCalledWith({
            where: { id: venueId },
          });
          expect(prismaMock.amenityToVenue.deleteMany).toHaveBeenCalledWith({
            where: { venueId },
          });
          expect(prismaMock.amenityToVenue.createMany).not.toHaveBeenCalled();
          expect(result).toEqual({
            venueId,
            amenities: [],
          });
        });
      });
    });
    describe('and venue does not exist', () => {
      it('should throw NotFoundException', async () => {
        prismaMock.venue.findUnique.mockResolvedValue(null);
        await expect(
          venueService.updateVenueAmenities(999, updateAmenitiesDto),
        ).rejects.toThrow(NotFoundException);
      });
    });
    describe('and deleteMany throws error', () => {
      it('should throw error', async () => {
        prismaMock.venue.findUnique.mockResolvedValue(venuesArray[0]);
        prismaMock.amenityToVenue.deleteMany.mockRejectedValue(
          new Error('deleteMany error'),
        );
        await expect(
          venueService.updateVenueAmenities(venueId, updateAmenitiesDto),
        ).rejects.toThrow('deleteMany error');
      });
    });
    describe('and createMany throws error', () => {
      it('should throw error', async () => {
        prismaMock.venue.findUnique.mockResolvedValue(venuesArray[0]);
        prismaMock.amenityToVenue.deleteMany.mockResolvedValue({ count: 3 });
        prismaMock.amenityToVenue.createMany.mockRejectedValue(
          new Error('createMany error'),
        );
        await expect(
          venueService.updateVenueAmenities(venueId, updateAmenitiesDto),
        ).rejects.toThrow('createMany error');
      });
    });
  });

  describe('when updateVenueDetails is called', () => {
    let updateDetailsDto: UpdateVenueDetailsDto;
    let updatedVenue: any;
    let venueId: number;
    const newName = 'Nowa nazwa';
    const newCapacity = 10;
    const newDescription = 'Nowy opis';
    beforeEach(() => {
      venueId = venuesArray[0].id;
      updateDetailsDto = {
        name: newName,
        capacity: newCapacity,
        description: newDescription,
      };
      updatedVenue = {
        ...venuesArray[0],
        name: newName,
        capacity: newCapacity,
        description: newDescription,
      };
      prismaMock.venue.findUnique.mockClear();
      prismaMock.venue.update.mockClear();
    });
    describe('and venue exists', () => {
      beforeEach(() => {
        prismaMock.venue.findUnique.mockResolvedValue(venuesArray[0]);
      });
      it('should update the venue with provided details and return updated venue', async () => {
        prismaMock.venue.update.mockResolvedValue(updatedVenue);
        const result = await venueService.updateVenueDetails(
          venueId,
          updateDetailsDto,
        );
        expect(prismaMock.venue.findUnique).toHaveBeenCalledWith({
          where: { id: venueId },
        });
        expect(prismaMock.venue.update).toHaveBeenCalledWith({
          where: { id: venueId },
          data: {
            name: newName,
            capacity: newCapacity,
            description: newDescription,
          },
        });
        expect(result).toEqual(updatedVenue);
      });
      it('should not update anything if dto is empty, just return the venue', async () => {
        prismaMock.venue.update.mockResolvedValue(venuesArray[0]);
        const result = await venueService.updateVenueDetails(venueId, {});
        expect(prismaMock.venue.update).toHaveBeenCalledWith({
          where: { id: venueId },
          data: {},
        });
        expect(result).toEqual(venuesArray[0]);
      });
      it('should throw error from update', async () => {
        prismaMock.venue.update.mockRejectedValue(new Error('update error'));
        await expect(
          venueService.updateVenueDetails(venueId, updateDetailsDto),
        ).rejects.toThrow('update error');
      });
    });
    describe('and venue does not exist', () => {
      it('should throw NotFoundException', async () => {
        prismaMock.venue.findUnique.mockResolvedValue(null);
        await expect(
          venueService.updateVenueDetails(999, updateDetailsDto),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when delete is called', () => {
    describe('and venue exists', () => {
      it('should return deleted venue', async () => {
        prismaMock.venue.delete.mockResolvedValue(venuesArray[0]);
        const result = await venueService.delete(venuesArray[0].id);
        expect(result).toEqual(venuesArray[0]);
      });
    });
    describe('and venue does not exist', () => {
      it('should throw NotFoundException', async () => {
        prismaMock.venue.delete.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('Not found', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          });
        });
        await expect(venueService.delete(999)).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });

  describe('when getCombinedAmenities is called', () => {
    it('should return combined unique amenity IDs from amenities and occasion amenities', async () => {
      const amenities = [1, 2];
      const occasionIds = [10];
      prismaMock.occasion.findMany.mockResolvedValue([
        {
          id: 10,
          amenities: [{ id: 2 }, { id: 3 }],
        },
      ]);
      const result = await venueService.getCombinedAmenities(
        amenities,
        occasionIds,
      );
      expect(result.sort()).toEqual([1, 2, 3]);
    });

    it('should return only initial amenities if no occasionIds provided', async () => {
      const amenities = [1, 4];
      const occasionIds: number[] = [];
      const result = await venueService.getCombinedAmenities(
        amenities,
        occasionIds,
      );
      expect(result).toEqual([1, 4]);
    });

    it('should return only amenities if no matched occasions found', async () => {
      const amenities = [5, 6];
      const occasionIds = [99];
      prismaMock.occasion.findMany.mockResolvedValue([]);
      const result = await venueService.getCombinedAmenities(
        amenities,
        occasionIds,
      );
      expect(result).toEqual([5, 6]);
    });
  });

  describe('when findWithFilters is called', () => {
    beforeEach(() => {
      venueService.getCombinedAmenities = jest.fn().mockResolvedValue([1, 2]);
    });

    describe('and filters include location and radius', () => {
      it('should build correct where for latitude/longitude and call findMany', async () => {
        prismaMock.venue.findMany.mockResolvedValue([venuesArray[0]]);
        const filters = {
          latitude: 52.22,
          longitude: 21.01,
          radiusKm: 10,
        };

        const kmInDegree = 111;
        const deltaLat = filters.radiusKm / kmInDegree;
        const deltaLng =
          filters.radiusKm /
          (kmInDegree * Math.cos((filters.latitude * Math.PI) / 180));

        const expectedLatitude = {
          gte: filters.latitude - deltaLat,
          lte: filters.latitude + deltaLat,
        };
        const expectedLongitude = {
          gte: filters.longitude - deltaLng,
          lte: filters.longitude + deltaLng,
        };

        const result = await venueService.findWithFilters(filters);

        expect(prismaMock.venue.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              latitude: expectedLatitude,
              longitude: expectedLongitude,
            }),
            include: expect.any(Object),
          }),
        );
        expect(result).toEqual([venuesArray[0]]);
      });
    });

    describe('and filters are provided with full example', () => {
      it('should call findMany with all filter values', async () => {
        prismaMock.venue.findMany.mockResolvedValue([venuesArray[0]]);
        const filters = {
          amenities: venuesArray[0].amenities.map((a: { id: number }) => a.id),
          occasions: [],
          venueTypeId: 1,
          pricePerNightInEURCentMin: 10000,
          pricePerNightInEURCentMax: 20000,
          guests: 2,
          dateStart: '2025-07-01',
          dateEnd: '2025-07-02',
          latitude: 52.22,
          longitude: 21.01,
          radiusKm: 10,
        };

        const kmInDegree = 111;
        const deltaLat = filters.radiusKm / kmInDegree;
        const deltaLng =
          filters.radiusKm /
          (kmInDegree * Math.cos((filters.latitude * Math.PI) / 180));

        const expectedLatitude = {
          gte: filters.latitude - deltaLat,
          lte: filters.latitude + deltaLat,
        };
        const expectedLongitude = {
          gte: filters.longitude - deltaLng,
          lte: filters.longitude + deltaLng,
        };

        const result = await venueService.findWithFilters(filters);

        expect(venueService.getCombinedAmenities).toHaveBeenCalledWith(
          [1, 2],
          [],
        );
        expect(prismaMock.venue.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              AND: [
                { amenityToVenues: { some: { amenityId: 1 } } },
                { amenityToVenues: { some: { amenityId: 2 } } },
              ],
              venueTypeId: filters.venueTypeId,
              pricePerNightInEURCent: {
                gte: filters.pricePerNightInEURCentMin,
                lte: filters.pricePerNightInEURCentMax,
              },
              capacity: { gte: filters.guests },
              reservations: {
                none: {
                  isPendingRating: true,
                  dateStart: { lt: new Date(filters.dateEnd) },
                  dateEnd: { gt: new Date(filters.dateStart) },
                },
              },
              latitude: expectedLatitude,
              longitude: expectedLongitude,
            }),
            include: expect.any(Object),
          }),
        );
        expect(result).toEqual([venuesArray[0]]);
      });
    });

    describe('and only guests and price filters are provided', () => {
      it('should call findMany with only these filters', async () => {
        (venueService.getCombinedAmenities as jest.Mock).mockResolvedValue([]);
        prismaMock.venue.findMany.mockResolvedValue([venuesArray[1]]);
        const filters = {
          guests: 2,
          pricePerNightInEURCentMin: 5000,
          pricePerNightInEURCentMax: 10000,
        };

        const result = await venueService.findWithFilters(filters);

        expect(venueService.getCombinedAmenities).toHaveBeenCalledWith([], []);
        expect(prismaMock.venue.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              capacity: { gte: filters.guests },
              pricePerNightInEURCent: {
                gte: filters.pricePerNightInEURCentMin,
                lte: filters.pricePerNightInEURCentMax,
              },
            }),
            include: expect.any(Object),
          }),
        );
        expect(result).toEqual([venuesArray[1]]);
      });
    });

    describe('and no venue matches filters', () => {
      it('should throw NotFoundException', async () => {
        prismaMock.venue.findMany.mockResolvedValue([]);
        const filters = {
          amenities: [999],
          occasions: [],
          venueTypeId: 99,
          pricePerNightInEURCentMin: 50000,
          pricePerNightInEURCentMax: 60000,
          guests: 10,
          dateStart: '2030-01-01',
          dateEnd: '2030-01-05',
          latitude: 0,
          longitude: 0,
          radiusKm: 1,
        };
        await expect(venueService.findWithFilters(filters)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('and filters are not provided', () => {
      it('should return all venues', async () => {
        (venueService.getCombinedAmenities as jest.Mock).mockResolvedValue([]);
        prismaMock.venue.findMany.mockResolvedValue([
          venuesArray[0],
          venuesArray[1],
        ]);

        const filters = {};
        const result = await venueService.findWithFilters(filters);

        expect(venueService.getCombinedAmenities).toHaveBeenCalledWith([], []);
        expect(prismaMock.venue.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: {},
            include: expect.any(Object),
          }),
        );
        expect(result).toEqual([venuesArray[0], venuesArray[1]]);
      });
    });
  });

  describe('when getCityNames is called', () => {
    beforeEach(() => {
      prismaMock.venue.findMany.mockResolvedValue(venuesArray);
    });

    it('should ask Prisma for distinct city names ordered ascending and return only unique, sorted names', async () => {
      const cityNames = [
        venuesArray[0].city.toLowerCase(),
        venuesArray[1].city.toLowerCase(),
      ];
      const result = await venueService.getCityNames();

      expect(prismaMock.venue.findMany).toHaveBeenCalledWith({
        select: { city: true },
        distinct: ['city'],
        orderBy: { city: 'asc' },
      });
      expect(result).toEqual(cityNames);
    });

    it('should return an empty array if there are no venues', async () => {
      prismaMock.venue.findMany.mockResolvedValue([]);
      const result = await venueService.getCityNames();
      expect(result).toEqual([]);
    });
  });
});
