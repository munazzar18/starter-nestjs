import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { Role } from "src/roles/role.enum";

export class RegisterUserDto {
  @IsNotEmpty()
  @MinLength(3)
  firstName: string;

  @IsNotEmpty()
  @MinLength(3)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  mobile: string;

  @IsNotEmpty()
  address: string;

  otp: string;

  expiry_otp: number;

  roles: Role;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
