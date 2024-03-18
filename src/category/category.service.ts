import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { Repository } from "typeorm";
import { CreateCategoryDto, UpdateCategoryDto } from "./categoryDto.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private catRepo: Repository<Category>
  ) {}

  async findAll() {
    return this.catRepo.find();
  }

  async findById(id: number) {
    const category = await this.catRepo.findOneBy({ id });
    return category;
  }

  async create(createDto: CreateCategoryDto) {
    const category = this.catRepo.create(createDto);
    return this.catRepo.save(category);
  }

  async update(id: number, updateDto: UpdateCategoryDto) {
    const category = await this.findById(id);
    if (category) {
      category.category = updateDto.category;
      return this.catRepo.save(category);
    } else {
      throw new NotFoundException("category not found");
    }
  }
}
