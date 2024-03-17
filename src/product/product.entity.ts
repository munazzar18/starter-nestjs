import { Cart } from "src/cart/cart.entity";
import { Category } from "src/category/category.entity";
import { Order_Item } from "src/order_item/order_item.entity";
import { Reviews } from "src/reviews/reviews.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Index({ fulltext: true })
    @Column({ nullable: false })
    title: string;

    @Index({ fulltext: true })
    @Column({ nullable: false, type: 'text' })
    description: string;

    @Column({ nullable: false })
    price: number;

    @Column({ nullable: false })
    quantity: number;

    @Column('simple-array', { nullable: false })
    images: string[]

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ nullable: false })
    userId: number;

    @Column({ nullable: false })
    categoryId: number;

    @Column({ type: 'float', precision: 3, default: 0.0 })
    avg_reviews: number

    @OneToMany(() => Order_Item, (orderItems) => orderItems.product)
    orderItems: Order_Item[]


    @OneToMany(() => Cart, (cart) => cart.product)
    @JoinColumn({ name: 'cartId' })
    cart: Cart[]

    // @ManyToOne(() => Cart, (cart) => cart.products)
    // @JoinColumn({ name: 'cartId' })
    // cart: Cart

    @ManyToOne(() => UserEntity, (user) => user.product)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @ManyToOne(() => Category, (category) => category.product)
    @JoinColumn({ name: "categoryId" })
    category: Category

    @OneToMany(() => Reviews, (review) => review.product)
    reviews: Reviews[]

}