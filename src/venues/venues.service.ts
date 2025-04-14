import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class VenuesService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.venue.findMany();
  }
}
