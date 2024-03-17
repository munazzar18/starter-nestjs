import { IsNotEmpty } from "class-validator";

export class CreateCartDto {
    @IsNotEmpty()
    productId: number

    @IsNotEmpty()
    quantity: number
}