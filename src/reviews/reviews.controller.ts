import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewDto } from './reviewDto.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('reviews')
export class ReviewsController {
    constructor(
        private reviewService: ReviewsService
    ) { }

    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() reviewDto: ReviewDto, @Request() req) {
        const user = req.user
        const review = await this.reviewService.create(reviewDto, user)
        return review
    }



}
