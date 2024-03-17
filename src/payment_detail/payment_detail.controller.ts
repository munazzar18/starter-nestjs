import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, Request, Res, UseGuards } from '@nestjs/common';
import { PaymentDetailService } from './payment_detail.service';
import { Payment_Detail_Dto } from './payment_detail.dto';
import { sendJson } from 'src/helpers/helpers';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserEntity } from 'src/user/user.entity';

@Controller('payment-detail')
export class PaymentDetailController {
    constructor(
        private payment_Detail_Service: PaymentDetailService
    ) { }

    // @Get('session/:orderId')
    // async getStripSession(@Param('orderId', ParseIntPipe) orderId: number) {
    //     const session = await this.payment_Detail_Service.checkoutSession(orderId)
    //     return sendJson(true, "Session Successfull", session)
    // }

    // @Get('redirect')
    // async getStripeStatus(
    //     @Query('sid') sid: string,
    //     @Query('result') result: string,
    //     @Query('paymentId') paymentId: string
    // ) {
    //     console.log("Ye chala?")
    //     // console.log("Payemnt Id:", paymentId)
    //     const session = await this.payment_Detail_Service.stripeRedirect(sid, result, +paymentId)
    //     return sendJson(true, "Redirect Succcessfull", session)
    // }


    @Post("cash-on-delivery")
    @UseGuards(AuthGuard)
    async createPayment(@Body() paymentDto: Payment_Detail_Dto, @Request() req) {
        const authUser: UserEntity = req.user
        const payment = await this.payment_Detail_Service.create(paymentDto.orderId, authUser)
        return sendJson(true, "Payment Successfull, Order completed", payment)
    }

}
