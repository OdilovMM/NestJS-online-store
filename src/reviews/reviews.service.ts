/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(ReviewEntity) private readonly reviewRepo: Repository<ReviewEntity>,
        private readonly productService: ProductsService
    ) {}

    async create(createReviewDto: CreateReviewDto, currentUser: UserEntity): Promise<ReviewEntity> {
        const product = await this.productService.findOne(createReviewDto.productId);
        let review = await this.findOneByUserAndProduct(currentUser.id, createReviewDto.productId);
        if (!review) {
            review = this.reviewRepo.create(createReviewDto);
            review.user = currentUser;
            review.product = product;
        } else {
            (review.comment = createReviewDto.comment), (review.ratings = createReviewDto.ratings);
        }
        return await this.reviewRepo.save(review);
    }

    async findAllByProduct(id: number): Promise<ReviewEntity[]> {
        const product = await this.productService.findOne(id);
        return await this.reviewRepo.find({
            where: { product: { id } },
            relations: {
                user: true,
                product: {
                    category: true
                }
            }
        });
    }

    async findOne(id: number): Promise<ReviewEntity> {
        const review = await this.reviewRepo.findOne({
            where: {
                id: id
            },
            relations: {
                user: true,
                product: {
                    category: true
                }
            }
        });

        if (!review) throw new NotFoundException('Review does not exist');
        return review;
    }

    async remove(id: number) {
        const review = await this.findOne(id);
        if (!review) throw new NotFoundException('Review not found');
        return this.reviewRepo.remove(review);
    }

    async findOneByUserAndProduct(userId: number, productId: number): Promise<ReviewEntity> {
        return await this.reviewRepo.findOne({
            where: {
                user: {
                    id: userId
                },
                product: {
                    id: productId
                }
            },
            relations: {
                user: true,
                product: {
                    category: true
                }
            }
        });
    }
}
