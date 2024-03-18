import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./order.entity";
import { In, Repository } from "typeorm";
import { Order_Item } from "src/order_item/order_item.entity";
import { Product } from "src/product/product.entity";
import { Payment_Detail } from "src/payment_detail/payment_detail.entity";
import { UserEntity } from "src/user/user.entity";
import { Status } from "src/payment_detail/payment_status.enum";
import { sendJson } from "src/helpers/helpers";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Order_Item)
    private order_item_repo: Repository<Order_Item>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Payment_Detail)
    private paymentRepo: Repository<Payment_Detail>
  ) {}

  async all() {
    return this.orderRepo.find();
  }

  async byId(id: number) {
    return this.orderRepo.findOneBy({ id });
  }

  async userOrder(userId: number) {
    const userOrder = await this.orderRepo.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ["payment_detail", "orderItems", "orderItems.product"],
    });

    if (!userOrder) {
      throw new NotFoundException("No Orders");
    }
    return userOrder;
  }

  // async create(orderItemId: number, quantity: number, authUser: UserEntity,) {

  //     const orderItem = await this.order_item_repo.findOne({
  //         where: {
  //             id: orderItemId
  //         },
  //         relations: ['product']
  //     })
  //     if (!orderItem) {
  //         throw new NotFoundException(sendJson(false, "No item find to place order"))
  //     }

  //     if (orderItem?.product?.quantity === 0) {
  //         throw new NotFoundException(sendJson(false, "Item out of stock"))
  //     }

  //     const totalPrice = orderItem.product.price * quantity

  //     const paymentDetail = new Payment_Detail()
  //     paymentDetail.amount = totalPrice
  //     paymentDetail.status = Status.Pending
  //     paymentDetail.provider = "JazzCash"
  //     paymentDetail.payment = 0
  //     const savedPaymentDetail = await this.paymentRepo.save(paymentDetail)

  //     const order = new Order()
  //     order.orderItems = [orderItem]
  //     order.payment_detail = savedPaymentDetail
  //     order.total = totalPrice
  //     order.user = authUser
  //     orderItem.product.quantity -= quantity
  //     await this.productRepo.save(orderItem.product)
  //     const savedOrder = await this.orderRepo.save(order)
  //     return savedOrder
  // }

  async create(
    orderItemIds: number[],
    quantities: number[],
    authUser: UserEntity
  ) {
    if (
      orderItemIds.length !== quantities.length ||
      orderItemIds.length === 0
    ) {
      throw new BadRequestException(
        "Invalid order items or quantities provided"
      );
    }

    const orderItems = await this.order_item_repo.find({
      where: {
        id: In(orderItemIds),
      },
      relations: ["product"],
    });

    if (!orderItems || orderItems.length === 0) {
      throw new NotFoundException(
        sendJson(false, "No items found to place order")
      );
    }

    const totalPrice = orderItems.reduce((total, item, index) => {
      const itemQuantity = quantities[index] > 0 ? quantities[index] : 1;
      return total + item.product.price * itemQuantity;
    }, 0);

    const outOfStockItems = orderItems.filter(
      (item, index) => item.product.quantity < quantities[index]
    );
    if (outOfStockItems.length > 0) {
      throw new NotFoundException(
        sendJson(false, "One or more items are out of stock")
      );
    }

    const paymentDetail = new Payment_Detail();
    paymentDetail.amount = totalPrice;
    paymentDetail.status = Status.Pending;
    paymentDetail.provider = "Stripe";
    paymentDetail.payment = 0;
    const savedPaymentDetail = await this.paymentRepo.save(paymentDetail);

    const order = new Order();
    order.orderItems = orderItems.map((item, index) => {
      const newItem = { ...item };
      newItem.quantity = quantities[index] > 0 ? quantities[index] : 1;
      item.product.quantity -= newItem.quantity;
      return newItem;
    });
    order.payment_detail = savedPaymentDetail;
    order.total = totalPrice;
    order.user = authUser;

    // Saving the updated product quantities
    for (const item of order.orderItems) {
      await this.productRepo.save(item.product);
    }

    const savedOrder = await this.orderRepo.save(order);
    return savedOrder;
  }
}
