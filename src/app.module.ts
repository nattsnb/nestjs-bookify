import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { VenuesAmenitiesModule } from './venuesAmenities/venuesAmenities.module';
import { VenuesDetailsModule } from './venuesDetails/venuesDetails.module';
import { VenuesModule } from './venues/venues.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    VenuesAmenitiesModule,
    VenuesModule,
    VenuesDetailsModule,
    AuthenticationModule,
  ],
})
export class AppModule {}
