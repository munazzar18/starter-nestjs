import { Module } from '@nestjs/common';
import { OrderItemController } from './order_item.controller';
import { OrderItemService } from './order_item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order_Item } from './order_item.entity';
import { Product } from 'src/product/product.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from 'src/constants/jwtConstants';

@Module({
  imports: [TypeOrmModule.forFeature([Order_Item, Product]),
  JwtModule.register({
    secret: JwtConstants.secret
  })
],
  controllers: [OrderItemController],
  providers: [OrderItemService]
})
export class OrderItemModule { }
