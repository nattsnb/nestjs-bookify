export class ReservationDto {
  id: number;
  dateStart: Date;
  dateEnd: Date;
  isPendingRating: boolean;
  venueId: number;
  userId: number;
}
