import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { sendJson } from "src/helpers/helpers";
import { AuthGuard } from "src/auth/auth.guard";
import { UserEntity } from "src/user/user.entity";
import { createOrderDto } from "./order.dto";

@Controller("order")
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  async findOrders() {
    const orders = await this.orderService.all();
    return sendJson(true, "Orders fetched", orders);
  }

  @Get("/:id")
  async findById(@Param("id", ParseIntPipe) id: number) {
    const order = await this.orderService.byId(id);
    return sendJson(true, "Order fetched Successfully", order);
  }

  @Get("/userId/:userId")
  async userOrder(@Param("userId", ParseIntPipe) userId: number) {
    const userOrder = await this.orderService.userOrder(userId);
    return sendJson(true, "Order found successfully", userOrder);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createOrder(@Body() orderDto: createOrderDto, @Request() req) {
    const user: UserEntity = req.user;
    if (!orderDto.orderItemIds) {
      throw new NotFoundException(
        sendJson(false, "No item found to place order")
      );
    }
    const order = await this.orderService.create(
      orderDto.orderItemIds,
      orderDto.quantities,
      user
    );
    return sendJson(true, "Order created Successfully", order);
  }
}
