import { IsNotEmpty } from "class-validator";

export class Payment_Detail_Dto {
  @IsNotEmpty()
  orderId: number;

  @IsNotEmpty()
  payment: number;
}
