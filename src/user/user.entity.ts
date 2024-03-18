import { Exclude } from "class-transformer";
import { Cart } from "src/cart/cart.entity";
import { Order } from "src/order/order.entity";
import { Order_Item } from "src/order_item/order_item.entity";
import { Product } from "src/product/product.entity";
import { Reviews } from "src/reviews/reviews.entity";
import { Role } from "src/roles/role.enum";
import {
  Column,
  Double,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from "typeorm";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false })
  mobile: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ type: "numeric", precision: 18, scale: 0, nullable: true })
  expiry_otp: number;

  @Column({ type: "enum", enum: Role, default: Role.User })
  roles: Role;

  @OneToMany(() => Cart, (cart) => cart.user)
  cart: Cart[];

  @OneToMany(() => Order_Item, (orderItem) => orderItem.user)
  orderItem: Order_Item;

  @OneToMany(() => Reviews, (review) => review.user)
  reviews: Reviews[];

  @OneToMany(() => Product, (product) => product.user)
  @JoinColumn({ name: "product" })
  product: Product[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}

export class serializedUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  address: string;
  roles: Role;

  @Exclude()
  password: string;
  @Exclude()
  otp: string;
  @Exclude()
  expiry_otp: number;

  constructor(partial: Partial<serializedUser>) {
    Object.assign(this, partial);
  }
}
