import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from './constants/jwtConstants';
import { DataSource } from 'typeorm';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { MulterModule } from '@nestjs/platform-express';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order_item/order_item.module';
import { CartModule } from './cart/cart.module';
import { PaymentDetailModule } from './payment_detail/payment_detail.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { StripeModule } from 'nestjs-stripe';
import { EncryptionModule } from './encryption/encryption/encryption.module';
import { ReviewsModule } from './reviews/reviews.module';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: '',
      database: 'fcommerce',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/uploads/images',
      rootPath: join(__dirname, '..', 'uploads', 'images'),
      serveStaticOptions: {
        index: false,
      },
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MailerModule.forRoot({
      transport: {
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASS
        }
      }
    }),
    StripeModule.forRoot({
      apiKey: process.env.SECRET_KEY,
    }),
    MulterModule.register({
      dest: './uploads/images/',
    }),
    UserModule,
    AuthModule,
    PassportModule,
    JwtModule.register({
      secret: JwtConstants.secret
    }),
    ProductModule,
    CategoryModule,
    OrderModule,
    OrderItemModule,
    CartModule,
    PaymentDetailModule,
    EncryptionModule,
    ReviewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private datasource: DataSource) { }
}
