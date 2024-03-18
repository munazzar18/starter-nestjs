import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./order.entity";
import { UserEntity } from "src/user/user.entity";
import { Order_Item } from "src/order_item/order_item.entity";
import { Product } from "src/product/product.entity";
import { Payment_Detail } from "src/payment_detail/payment_detail.entity";
import { JwtModule } from "@nestjs/jwt";
import { JwtConstants } from "src/constants/jwtConstants";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      UserEntity,
      Order_Item,
      Product,
      Payment_Detail,
    ]),
    JwtModule.register({
      secret: JwtConstants.secret,
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
