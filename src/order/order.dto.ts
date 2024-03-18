import { IsNotEmpty } from "class-validator";

export class createOrderDto {
  @IsNotEmpty()
  orderItemIds: number[];

  @IsNotEmpty()
  quantities: number[];
}
