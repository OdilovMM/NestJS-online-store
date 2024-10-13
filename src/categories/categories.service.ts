/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class CategoriesService {
    constructor(@InjectRepository(CategoryEntity) private categoryRepo: Repository<CategoryEntity>) {}

    async create(createCategoryDto: CreateCategoryDto, currentUser: UserEntity): Promise<CategoryEntity> {
        const category = this.categoryRepo.create(createCategoryDto);
        category.addedBy = currentUser;
        return await this.categoryRepo.save(category);
    }

    async findAll(): Promise<CategoryEntity[]> {
        return await this.categoryRepo.find();
    }

    async findOne(id: number): Promise<CategoryEntity> {
        const category = await this.categoryRepo.findOne({
            where: { id: id },
            relations: { addedBy: true },
            select: {
                addedBy: {
                    id: true,
                    name: true
                }
            }
        });
        if (!category) throw new NotFoundException(`Category not found with that id of ${id}`);
        return category;
    }

    async update(id: number, fields: Partial<UpdateCategoryDto>): Promise<CategoryEntity> {
        const category = await this.findOne(id);
        if (!category) throw new NotFoundException('Category not found');
        Object.assign(category, fields);
        return await this.categoryRepo.save(category);
    }

}
