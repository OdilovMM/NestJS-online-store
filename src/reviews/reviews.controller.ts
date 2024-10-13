/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/utility/common/user-roles.enum';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @UseGuards(AuthenticationGuard)
    @Post('add-review')
    async create(@Body() createReviewDto: CreateReviewDto, @CurrentUser() currentUser: UserEntity) {
        return await this.reviewsService.create(createReviewDto, currentUser);
    }

    @Get()
    async findAllProduct(@Body('productId') productId: number) {
        return await this.reviewsService.findAllByProduct(+productId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.reviewsService.findOne(+id);
    }
   

    @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.reviewsService.remove(+id);
    }
}
