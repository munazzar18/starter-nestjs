import { Body, Controller, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { sendJson } from 'src/helpers/helpers';
import { CreateCategoryDto, UpdateCategoryDto } from './categoryDto.dto';

@Controller('category')
export class CategoryController {
    constructor(
        private catService: CategoryService
    ){}

    @Get()
    async categories(){
        try {
            const categories = await this.catService.findAll()
            return sendJson(true, 'All categories', categories)
        } catch (error) {
            console.error(error)
            throw new NotFoundException('No category found for this id')
        }
        }
        
    @Get('/:id')
    async categoryById(@Param('id', ParseIntPipe) id: number){
        
            const category = await this.catService.findById(id)
            if(category){
                return sendJson(true, 'Category found successfully', category)
            } else {

                throw new NotFoundException('No category found for this id')
            }
    }

    @Post()
    async create(@Body() createDto: CreateCategoryDto){
        try {
            const category = await this.catService.create(createDto)
            return sendJson(true, 'Category created successfully', category)
        } catch (error) {
            console.error(error)
        }
    }
    @Put('/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateCategoryDto){
        try {
            const category = await this.catService.update(id, updateDto)
            return sendJson(true, 'Category Updated Successfully', category)
        } catch (error) {
            console.error(error)
            throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST)
        }
    }
}
