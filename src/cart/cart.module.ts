import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "./cart.entity";
import { UserEntity } from "src/user/user.entity";
import { Product } from "src/product/product.entity";
import { JwtModule } from "@nestjs/jwt";
import { JwtConstants } from "src/constants/jwtConstants";

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, UserEntity, Product]),
    JwtModule.register({
      secret: JwtConstants.secret,
    }),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
