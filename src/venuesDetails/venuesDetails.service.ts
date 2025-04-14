import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class VenuesDetailsService {
  constructor(private readonly prismaService: PrismaService) {}

  getById(id: number) {
    return this.prismaService.venue.findUnique({ where: { id: id } });
  }
}
