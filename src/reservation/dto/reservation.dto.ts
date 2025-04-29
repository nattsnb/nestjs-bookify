import { StatusEnum } from '.prisma/client';

export class ReservationDto {
  id: number;
  dateStart: Date;
  dateEnd: Date;
  status: StatusEnum;
  venueId: number;
  userId: number;
}
