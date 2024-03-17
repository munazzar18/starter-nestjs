import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Status } from "./payment_status.enum";
import { Order } from "src/order/order.entity";


@Entity()
export class Payment_Detail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount: number;

    @Column({type: 'enum', enum: Status, default: Status.Unpaid})
    status: Status;

    @Column()
    payment: number;

    @Column()
    provider: string;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

    @OneToOne(() => Order, (order) => order.payment_detail)
    order: Order;
}