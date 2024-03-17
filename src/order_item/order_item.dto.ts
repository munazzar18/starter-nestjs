import { IsNotEmpty } from "class-validator";

export class OrderItemDto {
    @IsNotEmpty()
    productId: number;
    @IsNotEmpty()
    quantity: number;
}