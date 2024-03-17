import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Product } from 'src/product/product.entity';
import e from 'express';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart) private cartRepo: Repository<Cart>,
        @InjectRepository(Product) private productRepo: Repository<Product>
    ) { }

    async findAllCart() {
        return this.cartRepo.find()
    }

    async findCartById(id: number) {
        return this.cartRepo.findOneBy({ id })
    }

    async findUserCart(userId: number) {
        const cart = await this.cartRepo.find({
            where: {
                user: {
                    id: userId
                }
            },
            relations: ['product']
        })
        const allCarts = cart.map((item) => {
            const itemImages = item.product.images.map((img) => process.env.BASE_URL + img)
            item.product.images = itemImages
            return item
        })
        return allCarts
    }

    async create(productId: number, quantity: number, authUser: UserEntity) {
        const selectedProduct = await this.productRepo.findOne({
            where: { id: productId }
        });

        if (!selectedProduct) {
            throw new NotFoundException('No product to add in cart!');
        }

        const existingProduct = await this.cartRepo.findOne({
            where: {
                product: {
                    id: selectedProduct.id
                },
                user: {
                    id: authUser.id
                }
            }
        })
        if (existingProduct) {
            existingProduct.user = authUser;
            existingProduct.product = selectedProduct
            existingProduct.quantity += quantity
            existingProduct.totalPrice = existingProduct.quantity * selectedProduct.price
            await this.cartRepo.save(existingProduct)
            return existingProduct
        }
        else {
            const cart = new Cart()
            cart.user = authUser
            cart.product = selectedProduct
            cart.quantity = quantity;
            cart.totalPrice = selectedProduct.price
            await this.cartRepo.save(cart)
            return cart
        }
    }
    async deleteItem(productId: number, quantity: number, authUser: UserEntity) {
        const selectedProduct = await this.productRepo.findOne({
            where: {
                id: productId,
            }
        });

        if (!selectedProduct) {
            throw new NotFoundException('No product found for this id');
        }

        const exisistingItem = await this.cartRepo.findOne({
            where: {
                product: {
                    id: selectedProduct.id
                }
            }
        });

        if (exisistingItem.quantity > 0) {
            const remainingQuantity = exisistingItem.quantity - quantity;

            if (remainingQuantity > 0) {
                exisistingItem.quantity = remainingQuantity;
                exisistingItem.totalPrice = remainingQuantity * selectedProduct.price;
                await this.cartRepo.save(exisistingItem);
                return exisistingItem;
            } else {
                await this.cartRepo.delete(exisistingItem.id);
                return null;
            }
        } else {
            return null;
        }
    }
}


