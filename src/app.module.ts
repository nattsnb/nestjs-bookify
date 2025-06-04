import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthenticationModule } from './authentication/authentication.module';
import { OccasionModule } from './occasion/occasion.module';
import { VenueModule } from './venue/venue.module';
import { CategoryModule } from './category/category.module';
import { AmenityModule } from './amenity/amenity.module';
import { ReservationModule } from './reservation/reservation.module';
import { FavouriteModule } from './favourite/favourite.module';
import { RatingModule } from './rating/rating.module';
import { VenueTypeModule } from './venue-type/venue-type.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.number().required(),
      }),
    }),
    VenueModule,
    OccasionModule,
    CategoryModule,
    AmenityModule,
    AuthenticationModule,
    ReservationModule,
    FavouriteModule,
    RatingModule,
    VenueTypeModule,
  ],
})
export class AppModule {}
