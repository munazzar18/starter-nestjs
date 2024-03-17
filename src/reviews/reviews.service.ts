import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reviews } from './reviews.entity';
import { In, Repository } from 'typeorm';
import { Order } from 'src/order/order.entity';
import { Payment_Detail } from 'src/payment_detail/payment_detail.entity';
import { Status } from 'src/payment_detail/payment_status.enum';
import { UserEntity } from 'src/user/user.entity';
import { Order_Status } from 'src/order/order_status_enum';
import { ReviewDto } from './reviewDto.dto';
import { sendJson } from 'src/helpers/helpers';
import { Product } from 'src/product/product.entity';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Reviews) private reviewRepo: Repository<Reviews>,
        @InjectRepository(Order) private orderRepo: Repository<Order>,
        @InjectRepository(Product) private productRepo: Repository<Product>
    ) { }


    async findAll() {
        return await this.reviewRepo.find()
    }

    async findById(id: number) {
        return await this.reviewRepo.findOneBy({ id })
    }

    async create(reviewDto: ReviewDto, authUser: UserEntity) {
        const order = await this.orderRepo.findOne({
            where: {
                id: reviewDto.orderId,
                order_status: Order_Status.completed,
                user: {
                    id: authUser.id
                }
            },
            relations: ['orderItems', 'payment_detail', 'orderItems.product']
        })
        if (!order) {
            throw new NotFoundException("Order not found")
        }

        const product = await this.productRepo.findOne({
            where: {
                id: order.orderItems[0].product.id
            }
        })

        const review = await this.reviewRepo.findOne({
            where: {
                product: {
                    id: order.orderItems[0].product.id
                },
            },
            relations: ['user']
        })
        if (review && review.user.id === authUser.id) {
            throw new BadRequestException("You have already given a review")
        }
        else {
            if (review && review.user.id !== authUser.id) {
                const newReview = new Reviews
                newReview.total_reviews = review.total_reviews + 1
                newReview.total_rating = review.total_rating + reviewDto.rating
                newReview.rating = review.total_rating / review.total_reviews
                newReview.order = order
                newReview.product = order.orderItems[0].product
                newReview.user = authUser
                newReview.review = reviewDto.review
                product.avg_reviews = newReview.rating
                await this.productRepo.save(product)
                return this.reviewRepo.save(newReview)
                // review.total_reviews += 1
                // review.total_rating += reviewDto.rating
                // review.rating = review.total_rating / review.total_reviews
                // review.order = order
                // review.product = order.orderItems[0].product
                // review.user = authUser
                // product.avg_reviews = review.rating
                // await this.productRepo.save(product)
                // return await this.reviewRepo.save(review)
            }
            else {
                const review = new Reviews
                review.rating = reviewDto.rating
                review.review = reviewDto?.review
                review.user = authUser
                review.product = order.orderItems[0].product
                review.order = order
                review.total_reviews = 1
                review.total_rating = reviewDto.rating
                product.avg_reviews = product.avg_reviews ? review.total_rating / review.total_reviews : reviewDto.rating
                await this.productRepo.save(product)
                const saveReview = await this.reviewRepo.save(review)
                return saveReview
            }
        }
    }
}
