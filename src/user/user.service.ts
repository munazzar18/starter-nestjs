import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './registerUser.dto';
// import { MailerService } from '@nestjs-modules/mailer';
import { Twilio } from 'twilio';
import { EncryptionService } from 'src/encryption/encryption/encryption.service';
import * as cypto from "crypto"


@Injectable()
export class UserService {
     private twilioClient: Twilio;
     constructor(
          @InjectRepository(UserEntity)
          private userRepo: Repository<UserEntity>,
          // private readonly mailerService: MailerService,
          private readonly encryptService: EncryptionService

     ) { }

     async findAll() {
          return await this.userRepo.find()
     }

     async findOneById(id: number) {
          return await this.userRepo.findOneBy({ id })
     }

     async findOneByEmail(email: string) {
          return await this.userRepo.findOneBy({ email })
     }

     async create(data: RegisterUserDto) {
          return await this.userRepo.save(data)

     }

     // async sendMail(email: string) {
     //      const encrypted = await this.encryptService.encrypt(email)
     //      const url = `https://localhost:5005/${encrypted}`
     //      const dycrypted = await this.encryptService.decrypt(encrypted)
     //      await this.mailerService.sendMail({
     //           to: email, // List of receivers email address
     //           from: 'fcommerce@outlook.com', // Senders email address
     //           subject: 'Password reset link', // Subject line
     //           html: `<p><b>Please do not reply to this message.</b> This is the link to reset your password, this link will expired in 30 minutes.</p>
     //           <br>Click this link to rest the password:</br>
     //           <br>
     //           <a href=${url}>
     //             ${url}
     //           </a>
     //           </br>`, // HTML body content
     //      })
     //           .then((success) => {
     //                console.log("Success:", success)
     //           })
     //           .catch((err) => {
     //                console.log("ERROR AYA HA:", err)
     //           });

     //      return {
     //           url: url,
     //           decryptData: dycrypted,
     //      }
     // }

     async sendOTP(email: string, otp: string) {
          const currentTime = new Date().getTime()
          const user = await this.findOneByEmail(email)
          const expiry = user.expiry_otp
          const dbOtp = user.otp
          if (expiry >= currentTime) {
               if (otp === dbOtp) {
                    return await this.userRepo.save(user)
               }
               else {
                    throw new BadRequestException("OTP is incorrect")
               }
          } else {
               throw new BadRequestException("OTP Expired")
          }
     }
}
