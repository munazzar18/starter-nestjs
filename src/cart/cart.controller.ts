import { Body, Controller, Get, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { sendJson } from 'src/helpers/helpers';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { CreateCartDto } from './cartDto.dto';

@Controller('cart')
export class CartController {
    constructor(
        private cartService: CartService
    ) { }

    @Get()
    async getCarts() {
        const carts = await this.cartService.findAllCart()
        return sendJson(true, "cart fetched successfully", carts)
    }

    @Get('/:id')
    async getCartById(@Param('id', ParseIntPipe) id: number) {
        const cart = await this.cartService.findCartById(id)
        return sendJson(true, "cart found successfully", cart)
    }

    @Get('/userCart/:userId')
    async getUserCart(@Param('userId', ParseIntPipe) userId: number) {
        const cart = await this.cartService.findUserCart(userId)
        return sendJson(true, "User Cart found successfully", cart)
    }

    @Post()
    @UseGuards(AuthGuard)
    async createcart(@Body() createCart: CreateCartDto, @Request() req) {
        const userId: UserEntity = req.user
        const cart = await this.cartService.create(createCart.productId, createCart.quantity, userId)
        return sendJson(true, "Item added to cart successfully", cart)
    }

    @Post('delete')
    @UseGuards(AuthGuard)
    async deleteCart(@Body() createCart: CreateCartDto, @Request() req) {
        const user: UserEntity = req.user
        const cartItem = await this.cartService.deleteItem(createCart.productId, createCart.quantity, user)
        return sendJson(true, "Item removed from cart successfully", cartItem)
    }
}
