import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { VenuesDetailsService } from './venuesDetails.service';

@Controller('venues')
export class VenuesDetailsController {
  constructor(private readonly venuesDetailsService: VenuesDetailsService) {}

  @Get(':id')
  getOneProduct(@Param('id', ParseIntPipe) id: number) {
    return this.venuesDetailsService.getById(id);
  }
}
