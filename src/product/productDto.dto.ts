import { IsNotEmpty, MinLength } from "class-validator";

export class CreateProductDto {
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  images: string[];

  @IsNotEmpty()
  quantity: number;

  userId: number;

  @IsNotEmpty()
  categoryId: number;
}

export class UpdateProductDto {
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  images: string[];

  @IsNotEmpty()
  quantity: number;

  userId: number;

  @IsNotEmpty()
  categoryId: number;
}

export class UploadFileDto {
  filePath: string;
}
