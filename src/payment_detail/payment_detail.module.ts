import { Module } from "@nestjs/common";
import { PaymentDetailController } from "./payment_detail.controller";
import { PaymentDetailService } from "./payment_detail.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment_Detail } from "./payment_detail.entity";
import { UserEntity } from "src/user/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { JwtConstants } from "src/constants/jwtConstants";
import { Order } from "src/order/order.entity";
import { Product } from "src/product/product.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment_Detail, Order, UserEntity, Product]),
    JwtModule.register({
      secret: JwtConstants.secret,
    }),
  ],
  controllers: [PaymentDetailController],
  providers: [PaymentDetailService],
})
export class PaymentDetailModule {}
