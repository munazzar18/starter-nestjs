import { Order } from "src/order/order.entity";
import { Product } from "src/product/product.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Order_Item {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    quantity: number

    @Column()
    totalPrice: number

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => UserEntity, user => user.id)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;


    @ManyToOne(() => Order, order => order.orderItems)
    order: Order;

    @ManyToOne(() => Product, product => product.orderItems)
    product: Product;
    item: import("c:/Users/DELL/Desktop/NestJs/fcommerce/src/user/user.entity").serializedUser;

}