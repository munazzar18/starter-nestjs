import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment_Detail } from './payment_detail.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Order } from 'src/order/order.entity';
import { sendJson } from 'src/helpers/helpers';
import { Status } from './payment_status.enum';
// import Stripe from "stripe"
import { Order_Status } from 'src/order/order_status_enum';

@Injectable()
export class PaymentDetailService {
    constructor(
        @InjectRepository(Payment_Detail) private paymentDetail: Repository<Payment_Detail>,
        @InjectRepository(Order) private order: Repository<Order>,
    ) { }
    // private stripe = new Stripe(process.env.SECRET_KEY);

    async get() {
        const paymentDetail = await this.paymentDetail.find()
        return paymentDetail
    }

    // async checkoutSession(orderId: number) {

    //     const order = await this.order.findOne({
    //         where: {
    //             id: orderId
    //         },
    //         relations: ['orderItems', 'payment_detail', 'orderItems.product']
    //     })


    //     const payment = order.payment_detail.amount
    //     const product = order.orderItems[0].product
    //     const quantity = order.orderItems[0].quantity
    //     const checkoutCustomSession = await this.stripe.checkout.sessions.create({
    //         payment_method_types: ['card'],
    //         line_items: [
    //             {
    //                 price_data: {
    //                     currency: 'pkr',
    //                     product_data: {
    //                         name: product.title,
    //                         description: product.description,
    //                     },

    //                     unit_amount: payment * 100,
    //                 },

    //                 quantity: quantity,
    //             },
    //         ],
    //         mode: 'payment',
    //         success_url: "http://localhost:3000/payment/completed",//${request.get('host')}/stripe/redirect/success, // Replace with your success URL
    //         cancel_url: "https://instagram.com",//${request.get('host')}/stripe/redirect/failed, // Replace with your cancel URL
    //     });

    //     const session = {
    //         id: checkoutCustomSession.id,
    //         url: checkoutCustomSession.url
    //     }

    //     return session

    // }

    // async stripeRedirect(id: string, result: string, paymentId: number) {

    //     if (result !== 'success') {
    //         throw new BadRequestException('Your payment could not be processed. Please try again');
    //     }
    //     const stripeSessionId = id; // Implement your decryption logic here
    //     console.log("Stripe Id:", stripeSessionId)
    //     if (!stripeSessionId) {
    //         throw new BadRequestException('Your payment could not be processed. Please try again');
    //     }

    //     const stripe = new Stripe(process.env.SECRET_KEY);

    //     try {
    //         const stripeSession = await stripe.checkout.sessions.retrieve(stripeSessionId);

    //         if (stripeSession.payment_status === 'paid') {
    //             console.log("status:", stripeSession.payment_status)
    //             const amount = stripeSession.amount_total / 100;

    //             const model = await this.paymentDetail.findOne({
    //                 where: {
    //                     id: paymentId
    //                 },
    //                 relations: ['order', 'order.orderItems']
    //             })

    //             model.status = Status.Paid
    //             model.payment = amount
    //             model.provider = "Stripe"
    //             model.order.order_status = Order_Status.shipped
    //             model.order.orderItems.forEach((item) => console.log(item))




    //             await this.paymentDetail.save(model)
    //             return model;
    //         } else {
    //             throw new BadRequestException('Your payment could not be processed. Please try again');
    //         }
    //     } catch (error) {
    //         throw new BadRequestException('Error processing payment');
    //     }
    // }

    async create(orderId: number, authUser: UserEntity) {
        const order = await this.order.findOne({
            where: {
                id: orderId
            },
            relations: { payment_detail: true }
        })
        if (!order) {
            throw new NotFoundException(sendJson(false, "Order not found"))
        }
        if (order.payment_detail) {
            order.order_status = Order_Status.shipped
            order.user = authUser
            order.payment_detail.provider = "Cash on Delivery"
            order.payment_detail.amount = order.total
            order.payment_detail.status = Status.Paid
            await this.paymentDetail.save(order.payment_detail)
        } else {
            throw new BadRequestException(sendJson(false, "Amount does not matched"))
        }
        return order.payment_detail
    }

}