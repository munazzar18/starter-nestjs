import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyOTPDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    otp: string;
}