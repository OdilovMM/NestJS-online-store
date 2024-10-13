/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/utility/common/user-roles.enum';
import { CategoryEntity } from './entities/category.entity';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @ApiCreatedResponse({type: CategoryEntity})
    @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
    @Post('create-category')
    async create(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() currentUser: UserEntity): Promise<CategoryEntity> {
        return await this.categoriesService.create(createCategoryDto, currentUser);
    }

    @Get('all-categories')
    async findAll() {
        return await this.categoriesService.findAll();
    }

    @Get('single/:id')
    async findOne(@Param('id') id: string): Promise<CategoryEntity> {
        return await this.categoriesService.findOne(+id);
    }

    @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
    @Patch('single/:id')
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
        return this.categoriesService.update(+id, updateCategoryDto);
    }

}
