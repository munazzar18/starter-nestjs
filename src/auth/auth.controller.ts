import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { sendJson } from 'src/helpers/helpers';
import { RegisterUserDto } from 'src/user/registerUser.dto';
import { VerifyOTPDto } from './verifyOTPdto.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        const token = await this.authService.login(req.user)
        return sendJson(true, 'User login successfully', {
            access_token: token.access_token,
            user: token.user
        })
    }

    @Post('register')
    async register(@Body() data: RegisterUserDto) {
        const user = await this.authService.register(data)
        // return sendJson(true, 'User register successfully', {
        //     access_token: token.access_token,
        //     user: token.user
        // })
        return sendJson(true, 'User register successfully', user)
    }

    @Post('verify-otp')
    async verifyOtp(@Body() data: VerifyOTPDto) {
        const verify = await this.authService.verifyOtp(data.email, data.otp)
        return sendJson(true, "Otp Verified", {
            access_token: verify
        })
    }

}
