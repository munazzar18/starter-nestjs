import { IsNumber } from "class-validator";

export class ReviewDto {
  @IsNumber()
  rating: number;

  review: string;

  orderId: number;
}
