import { Test } from '@nestjs/testing';
import { VenueService } from './venue.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';

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

    const module = await Test.createTestingModule({
      providers: [
        VenueService,
        { provide: PrismaService, useValue: prismaMock },
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
    describe('and venues exist', () => {
      beforeEach(() => {
        prismaMock.venue.findMany.mockResolvedValue(venuesArray);
      });
      it('should return all venues with amenities included', async () => {
        const result = await venueService.getAll();
        expect(result).toEqual(venuesArray);
      });
    });
    describe('and no venues exist', () => {
      beforeEach(() => {
        prismaMock.venue.findMany.mockResolvedValue([]);
      });
      it('should throw NotFoundException', async () => {
        await expect(venueService.getAll()).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when getOne is called', () => {
    describe('and venue exists', () => {
      beforeEach(() => {
        prismaMock.venue.findUnique.mockResolvedValue(venuesArray[0]);
      });
      it('should return the venue', async () => {
        const result = await venueService.getOne(venuesArray[0].id);
        expect(result).toEqual(venuesArray[0]);
      });
    });
    describe('and venue does not exist', () => {
      beforeEach(() => {
        prismaMock.venue.findUnique.mockResolvedValue(null);
      });
      it('should throw NotFoundException', async () => {
        await expect(venueService.getOne(999)).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });

  describe('when create is called', () => {
    describe('and venue is created successfully', () => {
      beforeEach(() => {
        jest.spyOn(venueService as any, 'geocodeAddress').mockResolvedValue({
          lat: 52.2297,
          lon: 21.0122,
        });
        prismaMock.venue.create.mockResolvedValue(venuesArray[0]);
      });

      it('should create a venue and return it', async () => {
        const result = await venueService.create(
          createVenueData,
          venuesArray[0].ownerId,
        );
        expect(result).toEqual(venuesArray[0]);
      });
    });
    describe('and venue creation fails due to missing relation', () => {
      beforeEach(() => {
        prismaMock.venue.create.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('Not found', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          });
        });
      });
      it('should throw NotFoundException', async () => {
        await expect(
          venueService.create(createVenueData, venuesArray[0].ownerId),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when update is called', () => {
    let updateData: UpdateVenueDto;
    let updatedVenue: any;
    const newName = 'Updated Venue Name';
    beforeEach(() => {
      updateData = { name: newName };
      updatedVenue = {
        ...venuesArray[0],
        name: newName,
      };
    });
    describe('and update succeeds', () => {
      beforeEach(() => {
        prismaMock.venue.findUnique.mockResolvedValue(venuesArray[0]); // ✅ fix
        prismaMock.venue.update.mockResolvedValue(updatedVenue);
      });
      it('should return the updated venue', async () => {
        const result = await venueService.update(venuesArray[0].id, updateData);
        expect(result).toEqual(updatedVenue);
      });
    });
    describe('and venue does not exist', () => {
      beforeEach(() => {
        prismaMock.venue.update.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('Not found', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          });
        });
      });
      it('should throw NotFoundException', async () => {
        await expect(
          venueService.update(venuesArray[0].id, updateData),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when delete is called', () => {
    describe('and venue exists', () => {
      beforeEach(() => {
        prismaMock.venue.delete.mockResolvedValue(venuesArray[0]);
      });
      it('should return deleted venue', async () => {
        const result = await venueService.delete(venuesArray[0].id);
        expect(result).toEqual(venuesArray[0]);
      });
    });
    describe('and venue does not exist', () => {
      beforeEach(() => {
        prismaMock.venue.delete.mockImplementation(() => {
          throw new Prisma.PrismaClientKnownRequestError('Not found', {
            code: PrismaError.RecordDoesNotExist,
            clientVersion: Prisma.prismaVersion.client,
          });
        });
      });
      it('should throw NotFoundException', async () => {
        await expect(venueService.delete(999)).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });

  describe('wheen getCombinedAmenities is called', () => {
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
});
