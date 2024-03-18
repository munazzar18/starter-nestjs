import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Request,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { sendJson } from "src/helpers/helpers";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/roles/roles.guard";
import {
  CreateProductDto,
  UpdateProductDto,
  UploadFileDto,
} from "./productDto.dto";
import { Roles } from "src/roles/role.decorator";
import { Role } from "src/roles/role.enum";
import { UserEntity, serializedUser } from "src/user/user.entity";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { Response } from "express";

@Controller("product")
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async getAllProducts(
    @Query("page") page: number,
    @Query("categoryIds") categoryIds?: string,
    @Query("search") search?: string
  ) {
    if (categoryIds) {
      const catProducts = await this.productService.filterByCategory(
        categoryIds.split(",").map((id) => +id)
      );
      if (catProducts.length === 0) {
        sendJson(false, "No product found for this category", []);
      }
      return sendJson(true, "Products found successfully", catProducts);
    }

    if (search) {
      const strProducts = await this.productService.searchFilter(search);
      if (strProducts.length === 0) {
        sendJson(false, `No products found for '${search}'`, []);
      }
      return sendJson(true, "Products found succssfully!!", strProducts);
    }

    const products = await this.productService.allProducts(page);
    return sendJson(true, "Products found successfully", products);
  }

  @Get("category")
  async filterByCategory(
    @Query("categoryIds", new ParseArrayPipe({ items: Number, separator: "," }))
    categoryIds: number[]
  ) {
    const products = await this.productService.filterByCategory(categoryIds);
    if (products) {
      return sendJson(true, "Filtered Products found successfully", products);
    } else {
      throw new NotFoundException("No products found for this category");
    }
  }

  @Get("search")
  async searchFilter(@Query("search") search: string) {
    try {
      const products = await this.productService.searchFilter(search);
      return sendJson(true, "Product found successfully", products);
    } catch (error) {
      throw new NotFoundException(`No products found for this ${search}`);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get("/:id")
  async getById(@Param("id", ParseIntPipe) id: number) {
    const product = await this.productService.productById(id);
    if (product) {
      const user = new serializedUser(product.user);
      return sendJson(true, "Product found successfully", { ...product, user });
    } else {
      throw new NotFoundException("No product found");
    }
  }

  @Get("/userId/:userId")
  async getUserProducts(@Param("userId", ParseIntPipe) userId: number) {
    const product = await this.productService.productForAuthUser(userId);
    if (!product) {
      throw new NotFoundException(sendJson(false, "No product found"));
    }
    return product;
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Seller)
  async create(@Body() createDto: CreateProductDto, @Request() req) {
    const userId: UserEntity = req.user;
    const product = await this.productService.create(createDto, userId);
    return sendJson(true, "Product created Successfully", product);
  }

  @Put("/:id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Seller)
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateProductDto,
    @Request() req
  ) {
    const userId: UserEntity = req.user;
    const product = await this.productService.update(id, updateDto, userId);
    return sendJson(true, "Product updated successfully", product);
  }

  @Delete("/:id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Seller)
  async deleteProduct(@Param("id", ParseIntPipe) id: number, @Request() req) {
    const userId: UserEntity = req.user;
    const product = await this.productService.deleteProduct(id, userId);
    return sendJson(true, "Product deleted successfully", product);
  }

  @Post("upload")
  @UseInterceptors(
    FilesInterceptor("files", 10, {
      storage: diskStorage({
        destination: "./uploads/images/",
        filename: (req, file, callback) => {
          const orginalName = file.originalname;
          const extention = extname(orginalName);
          const fileName = Date.now() + extention;
          callback(null, fileName);
        },
      }),
    })
  )
  uploadImage(
    @Body() body: UploadFileDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req
  ) {
    // const protocol = req.protocol + "://";
    // const host = req.get("host");
    // const originUrl = req.originalUrl;
    // const fullUrlPath = protocol + host
    const fileUrls = files.map((file) => "/uploads/images/" + file.filename);
    return sendJson(true, "Images uploaded successfully", fileUrls);
  }

  @Get("uploads/images/:path")
  async getImages(@Param("path") path: string, @Res() res: Response) {
    const imagePath = join(__dirname, "..", "uploads", "images", path);
    return res.sendFile(imagePath);
  }
}
