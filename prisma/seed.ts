import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const venueTypes = [
    { id: 1, name: 'house' },
    { id: 2, name: 'apartment' },
    { id: 3, name: 'villa' },
    { id: 4, name: 'cabin' },
    { id: 5, name: 'bungalow' },
    { id: 6, name: 'loft' },
    { id: 7, name: 'castle' },
  ];

  const categories = [
    { id: 2, name: 'venue amenities' },
    { id: 3, name: 'room amenities' },
    { id: 4, name: 'handicap accessibility' },
    { id: 5, name: 'neighbourhoods' },
  ];

  const amenities = [
    { id: 1, name: 'indoor music', categoryId: 2 },
    { id: 2, name: 'jacuzzi', categoryId: 2 },
    { id: 3, name: 'playground', categoryId: 2 },
    { id: 4, name: 'restaurant', categoryId: 2 },
    { id: 5, name: '24h reception', categoryId: 2 },
    { id: 6, name: 'speakers', categoryId: 2 },
    { id: 7, name: 'bar', categoryId: 2 },
    { id: 8, name: 'fitness centre', categoryId: 2 },
    { id: 9, name: 'karaoke', categoryId: 2 },
    { id: 10, name: 'pet friendly', categoryId: 2 },
    { id: 11, name: 'WiFi', categoryId: 2 },
    { id: 12, name: 'outdoor music', categoryId: 2 },
    { id: 13, name: 'garden', categoryId: 2 },
    { id: 14, name: 'parking', categoryId: 2 },
    { id: 15, name: 'pool', categoryId: 2 },
    { id: 16, name: 'library', categoryId: 2 },
    { id: 17, name: 'air conditioning', categoryId: 3 },
    { id: 18, name: 'hypoallergenic bedding', categoryId: 3 },
    { id: 19, name: 'bathroom facilities', categoryId: 3 },
    { id: 20, name: 'safe', categoryId: 3 },
    { id: 21, name: 'tv', categoryId: 3 },
    { id: 22, name: 'kitchen facilities', categoryId: 3 },
    { id: 23, name: 'short-grown friendly', categoryId: 4 },
    { id: 24, name: 'blind friendly', categoryId: 4 },
    { id: 25, name: 'deaf friendly', categoryId: 4 },
    { id: 26, name: 'wheelchair friendly', categoryId: 4 },
    { id: 27, name: 'lake', categoryId: 5 },
    { id: 28, name: 'park', categoryId: 5 },
    { id: 29, name: 'national park', categoryId: 5 },
    { id: 30, name: 'cinema', categoryId: 5 },
    { id: 31, name: 'mountains', categoryId: 5 },
    { id: 32, name: 'mail', categoryId: 5 },
    { id: 33, name: 'river', categoryId: 5 },
    { id: 34, name: 'forest', categoryId: 5 },
    { id: 35, name: 'amusement park', categoryId: 5 },
    { id: 36, name: 'zoo', categoryId: 5 },
    { id: 37, name: 'sea', categoryId: 5 },
    { id: 38, name: 'theatre', categoryId: 5 },
    { id: 39, name: 'historical monuments', categoryId: 5 },
    { id: 40, name: 'old town', categoryId: 5 },
    { id: 41, name: 'restaurant', categoryId: 5 },
    { id: 42, name: 'museum', categoryId: 5 },
    { id: 43, name: 'church', categoryId: 5 },
  ];

  const occasionsWithAmenities = [
    { id: 1,  name: 'conference',        amenities: [1,6,11,14,20,21,25,26,32,39] },
    { id: 3,  name: 'romantic getaway',  amenities: [2,4,7,15,18,20,37,39,40] },
    { id: 4,  name: 'family vacation',   amenities: [3,10,13,15] },
    { id: 5,  name: 'business trip',     amenities: [6,7,11,14] },
    { id: 6,  name: 'wedding',           amenities: [12,13,14,15] },
    { id: 7,  name: 'wellness retreat',  amenities: [2,8,13,15,17,22] },
    { id: 8,  name: 'music festival',    amenities: [1,9,12] },
    { id: 9,  name: 'cultural trip',     amenities: [16,41] },
    { id: 10, name: 'adventure',         amenities: [19] },
    { id: 11, name: 'beach holiday',     amenities: [4,7,15,17,21] },
    { id: 12, name: 'shopping trip',     amenities: [11,14] },
    { id: 13, name: 'educational trip',  amenities: [16] },
    { id: 14, name: 'party',             amenities: [1,7,9,12] },
    { id: 15, name: 'family lake trip',  amenities: [3,5,10,13,19,21] },
  ];

  await prisma.venueType.createMany({ data: venueTypes,  skipDuplicates: true });
  await prisma.category.createMany({   data: categories,  skipDuplicates: true });
  await prisma.amenity.createMany({    data: amenities,   skipDuplicates: true });
  await prisma.occasion.createMany({
    data: occasionsWithAmenities.map(o => ({ id: o.id, name: o.name })),
    skipDuplicates: true,
  });

  for (const occ of occasionsWithAmenities) {
    await prisma.occasion.update({
      where: { id: occ.id },
      data: { amenities: { set: occ.amenities.map(id => ({ id })) } },
    });
  }

  const owner = await prisma.user.upsert({
    where: { email: 'owner@bookify.local' },
    update: {},
    create: {
      email: 'owner@bookify.local',
      password: 'changeme',
      name: 'Owner',
      phoneNumber: '+48 600 000 000',
    },
  });

  const sizes = [
    [1200, 800],
    [1280, 720],
    [1024, 683],
    [1366, 768],
    [800, 600],
    [1600, 900],
    [1080, 720],
    [1440, 960],
    [1280, 853],
    [1920, 1280],
  ] as const;

  const gallerySizes = [
    [800, 533],
    [1200, 900],
    [1024, 768],
    [1280, 854],
    [1400, 933],
  ] as const;

  const imgSet = (seed: string, idx: number) => {
    const [mw, mh] = sizes[idx % sizes.length];
    const g1 = gallerySizes[(idx + 1) % gallerySizes.length];
    const g2 = gallerySizes[(idx + 2) % gallerySizes.length];
    const g3 = gallerySizes[(idx + 3) % gallerySizes.length];
    return {
      main: `https://picsum.photos/seed/${seed}-${idx}/${mw}/${mh}`,
      gallery: [
        `https://picsum.photos/seed/${seed}-${idx}-a/${g1[0]}/${g1[1]}`,
        `https://picsum.photos/seed/${seed}-${idx}-b/${g2[0]}/${g2[1]}`,
        `https://picsum.photos/seed/${seed}-${idx}-c/${g3[0]}/${g3[1]}`,
      ],
    };
  };

  const venues = [
    {
      name: 'Sea View Apartment',
      description: 'Cozy flat with ocean view in Gdańsk.',
      city: 'Gdańsk',
      streetName: 'Długa',
      streetNumber: '1',
      postalCode: '80-827',
      latitude: 54.352,
      longitude: 18.6466,
      pricePerNightInEURCent: 8900,
      rating: 4.7,
      capacity: 4,
      amountsOfBeds: 2,
      extraSleepingDetails: 'Sofa bed in living room',
      checkInHour: 15,
      checkOutHour: 11,
      distanceFromCityCenterInMeters: 600,
      venueTypeId: 2,
      amenityIds: [11, 14, 17, 21],
      seed: 'sea-view',
    },
    {
      name: 'Old Town Loft',
      description: 'Stylish loft near the old town in Warsaw.',
      city: 'Warszawa',
      streetName: 'Krakowskie Przedmieście',
      streetNumber: '12',
      postalCode: '00-333',
      latitude: 52.24,
      longitude: 21.02,
      pricePerNightInEURCent: 10900,
      rating: 4.6,
      capacity: 2,
      amountsOfBeds: 1,
      extraSleepingDetails: 'Extra single mattress on request',
      checkInHour: 15,
      checkOutHour: 11,
      distanceFromCityCenterInMeters: 300,
      venueTypeId: 6,
      amenityIds: [11, 14, 20],
      seed: 'old-town-loft',
    },
    {
      name: 'Tatra Cabin',
      description: 'Wooden cabin with mountain views in Zakopane.',
      city: 'Zakopane',
      streetName: 'Kościeliska',
      streetNumber: '7',
      postalCode: '34-500',
      latitude: 49.2992,
      longitude: 19.9496,
      pricePerNightInEURCent: 7600,
      rating: 4.5,
      capacity: 5,
      amountsOfBeds: 3,
      extraSleepingDetails: 'Fold-out sofa',
      checkInHour: 16,
      checkOutHour: 10,
      distanceFromCityCenterInMeters: 1800,
      venueTypeId: 4,
      amenityIds: [13, 15, 17],
      seed: 'tatra-cabin',
    },
    {
      name: 'Riverside House',
      description: 'Spacious house by the river in Wrocław.',
      city: 'Wrocław',
      streetName: 'Nadodrzańska',
      streetNumber: '3A',
      postalCode: '50-200',
      latitude: 51.11,
      longitude: 17.03,
      pricePerNightInEURCent: 12500,
      rating: 4.8,
      capacity: 6,
      amountsOfBeds: 4,
      extraSleepingDetails: 'Two rollaway beds',
      checkInHour: 15,
      checkOutHour: 11,
      distanceFromCityCenterInMeters: 2200,
      venueTypeId: 1,
      amenityIds: [11, 13, 14, 22],
      seed: 'riverside-house',
    },
    {
      name: 'Forest Bungalow',
      description: 'Quiet bungalow surrounded by forest near Gdynia.',
      city: 'Gdynia',
      streetName: 'Leśna',
      streetNumber: '9',
      postalCode: '81-001',
      latitude: 54.5189,
      longitude: 18.5305,
      pricePerNightInEURCent: 6900,
      rating: 4.3,
      capacity: 3,
      amountsOfBeds: 2,
      extraSleepingDetails: 'Baby crib available',
      checkInHour: 14,
      checkOutHour: 10,
      distanceFromCityCenterInMeters: 5000,
      venueTypeId: 5,
      amenityIds: [10, 13, 14],
      seed: 'forest-bungalow',
    },
    {
      name: 'Castle Suite',
      description: 'Royal suite in a renovated castle near Kraków.',
      city: 'Kraków',
      streetName: 'Zamkowa',
      streetNumber: '2',
      postalCode: '30-001',
      latitude: 50.0619,
      longitude: 19.9368,
      pricePerNightInEURCent: 19900,
      rating: 4.9,
      capacity: 2,
      amountsOfBeds: 1,
      extraSleepingDetails: 'Can add baby crib',
      checkInHour: 15,
      checkOutHour: 11,
      distanceFromCityCenterInMeters: 2500,
      venueTypeId: 7,
      amenityIds: [2, 4, 7, 20],
      seed: 'castle-suite',
    },
    {
      name: 'Sopot Villa',
      description: 'Elegant villa close to the beach in Sopot.',
      city: 'Sopot',
      streetName: 'Grunwaldzka',
      streetNumber: '45',
      postalCode: '81-759',
      latitude: 54.4416,
      longitude: 18.5601,
      pricePerNightInEURCent: 14900,
      rating: 4.6,
      capacity: 8,
      amountsOfBeds: 5,
      extraSleepingDetails: 'Two sofa beds',
      checkInHour: 15,
      checkOutHour: 11,
      distanceFromCityCenterInMeters: 900,
      venueTypeId: 3,
      amenityIds: [11, 15, 17, 21],
      seed: 'sopot-villa',
    },
    {
      name: 'Poznań Apartment',
      description: 'Modern apartment near the old town in Poznań.',
      city: 'Poznań',
      streetName: 'Półwiejska',
      streetNumber: '5',
      postalCode: '61-888',
      latitude: 52.4064,
      longitude: 16.9252,
      pricePerNightInEURCent: 8200,
      rating: 4.4,
      capacity: 3,
      amountsOfBeds: 2,
      extraSleepingDetails: 'Sofa bed',
      checkInHour: 15,
      checkOutHour: 11,
      distanceFromCityCenterInMeters: 700,
      venueTypeId: 2,
      amenityIds: [11, 14, 22],
      seed: 'poznan-apartment',
    },
    {
      name: 'Łódź Loft Studio',
      description: 'Industrial loft studio in a historic factory.',
      city: 'Łódź',
      streetName: 'Piotrkowska',
      streetNumber: '120',
      postalCode: '90-006',
      latitude: 51.7592,
      longitude: 19.456,
      pricePerNightInEURCent: 7700,
      rating: 4.2,
      capacity: 2,
      amountsOfBeds: 1,
      extraSleepingDetails: 'Extra mattress available',
      checkInHour: 16,
      checkOutHour: 10,
      distanceFromCityCenterInMeters: 400,
      venueTypeId: 6,
      amenityIds: [11, 17, 21],
      seed: 'lodz-loft',
    },
    {
      name: 'Szczecin Riverside House',
      description: 'Bright house close to the river and parks.',
      city: 'Szczecin',
      streetName: 'Wały Chrobrego',
      streetNumber: '8',
      postalCode: '70-500',
      latitude: 53.429,
      longitude: 14.5636,
      pricePerNightInEURCent: 11500,
      rating: 4.5,
      capacity: 5,
      amountsOfBeds: 3,
      extraSleepingDetails: 'Pull-out couch',
      checkInHour: 15,
      checkOutHour: 11,
      distanceFromCityCenterInMeters: 1100,
      venueTypeId: 1,
      amenityIds: [11, 13, 14, 17],
      seed: 'szczecin-riverside',
    },
  ];

  for (let i = 0; i < venues.length; i++) {
    const data = venues[i];
    const imgs = imgSet(data.seed, i);
    const existing = await prisma.venue.findFirst({
      where: { name: data.name, city: data.city },
      select: { id: true },
    });
    if (existing) continue;

    await prisma.venue.create({
      data: {
        pricePerNightInEURCent: data.pricePerNightInEURCent,
        rating: data.rating,
        capacity: data.capacity,
        amountsOfBeds: data.amountsOfBeds,
        extraSleepingDetails: data.extraSleepingDetails,
        name: data.name,
        images: [imgs.main, ...imgs.gallery],
        description: data.description,
        checkInHour: data.checkInHour,
        checkOutHour: data.checkOutHour,
        distanceFromCityCenterInMeters: data.distanceFromCityCenterInMeters,
        streetNumber: data.streetNumber,
        streetName: data.streetName,
        postalCode: data.postalCode,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
        owner: { connect: { id: owner.id } },
        venueType: { connect: { id: data.venueTypeId } },
        amenityToVenues: {
          create: data.amenityIds.map((amenityId: number) => ({
            amenity: { connect: { id: amenityId } },
          })),
        },
      },
    });
  }

  console.log('Seed done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
