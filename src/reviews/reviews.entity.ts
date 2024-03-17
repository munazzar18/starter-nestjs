import { Order } from "src/order/order.entity";
import { Product } from "src/product/product.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Reviews {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'float', precision: 3, nullable: false, default: 0.0 })
    rating: number

    @Column({ type: 'float', precision: 3, nullable: false, default: 0.0 })
    total_rating: number

    @Column({ nullable: true })
    review: string

    @Column({ default: 0 })
    total_reviews: number

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => UserEntity, (user) => user.reviews)
    @JoinColumn({ name: 'userId' })
    user: UserEntity

    @ManyToOne(() => Product, (product) => product.reviews)
    @JoinColumn({ name: "productId" })
    product: Product

    @ManyToOne(() => Order, (order) => order.reviews)
    @JoinColumn({ name: 'orderId' })
    order: Order;

}