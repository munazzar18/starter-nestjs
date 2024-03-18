import { Product } from "src/product/product.entity";
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @OneToMany(() => Product, (product) => product.category)
  @JoinColumn({ name: "product" })
  product: Product[];
}
