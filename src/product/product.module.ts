import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { UserEntity } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtConstants } from "src/constants/jwtConstants";
import { EncryptionService } from "src/encryption/encryption/encryption.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, UserEntity]),
    JwtModule.register({
      secret: JwtConstants.secret,
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService, UserService, EncryptionService],
})
export class ProductModule {}
