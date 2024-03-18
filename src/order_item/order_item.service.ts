import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order_Item } from "./order_item.entity";
import { Repository } from "typeorm";
import { Product } from "src/product/product.entity";
import { UserEntity } from "src/user/user.entity";

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(Order_Item) private orderItemRepo: Repository<Order_Item>,
    @InjectRepository(Product) private prodRepo: Repository<Product>
  ) {}

  async getAll() {
    const ordetItems = this.orderItemRepo.find({
      relations: ["product"],
    });
    return ordetItems;
  }

  async getById(id: number) {
    const orderItem = this.orderItemRepo.findOne({
      where: {
        id: id,
      },
      relations: ["product"],
    });
    return orderItem;
  }

  async getByUserId(userId: number) {
    const orderItem = await this.orderItemRepo.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ["product", "user"],
    });

    const allOrders = orderItem.map((item) => {
      const itemImages = item.product.images.map(
        (img) => process.env.BASE_URL + img
      );
      item.product.images = itemImages;
      return item;
    });

    return allOrders;
  }

  async create(productId: number, quantity: number, authUser: UserEntity) {
    const selectedProduct = await this.prodRepo.findOne({
      where: {
        id: productId,
      },
    });

    if (!selectedProduct) {
      throw new NotFoundException("No product found for this id");
    }

    const exisistingItem = await this.orderItemRepo.findOne({
      where: {
        product: {
          id: selectedProduct.id,
        },
        user: {
          id: authUser.id,
        },
      },
    });

    if (exisistingItem) {
      exisistingItem.user = authUser;
      exisistingItem.product = selectedProduct;
      exisistingItem.quantity += quantity;
      exisistingItem.totalPrice =
        exisistingItem.quantity * selectedProduct.price;
      await this.orderItemRepo.save(exisistingItem);
      return exisistingItem;
    } else {
      const orderItem = new Order_Item();
      orderItem.user = authUser;
      orderItem.product = selectedProduct;
      orderItem.quantity = quantity;
      orderItem.totalPrice = selectedProduct.price * quantity;
      await this.orderItemRepo.save(orderItem);

      return orderItem;
    }
  }
  async deleteItem(productId: number, quantity: number, authUser: UserEntity) {
    const selectedProduct = await this.prodRepo.findOne({
      where: {
        id: productId,
      },
    });

    if (!selectedProduct) {
      throw new NotFoundException("No product found for this id");
    }

    const exisistingItem = await this.orderItemRepo.findOne({
      where: {
        product: {
          id: selectedProduct.id,
        },
      },
    });

    if (exisistingItem.quantity > 0) {
      const remainingQuantity = exisistingItem.quantity - quantity;

      if (remainingQuantity > 0) {
        exisistingItem.quantity = remainingQuantity;
        exisistingItem.totalPrice = remainingQuantity * selectedProduct.price;
        await this.orderItemRepo.save(exisistingItem);
        return exisistingItem;
      } else {
        await this.orderItemRepo.delete(exisistingItem.id);
        return null;
      }
    } else {
      return null;
    }
  }
}
