import { Module } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { ReviewsController } from "./reviews.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reviews } from "./reviews.entity";
import { Order } from "src/order/order.entity";
import { JwtModule } from "@nestjs/jwt";
import { JwtConstants } from "src/constants/jwtConstants";
import { Product } from "src/product/product.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Reviews, Order, Product]),
    JwtModule.register({
      secret: JwtConstants.secret,
    }),
  ],
  providers: [ReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
