/* eslint-disable prettier/prettier */
import { ProductEntity } from 'src/products/entities/product.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'reviews' })
export class ReviewEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ratings: number;

    @Column()
    comment: string;

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @ManyToOne((type) => UserEntity, (user) => user.reviews)
    user: UserEntity;

    @ManyToOne((type) => ProductEntity, (prod) => prod.reviews)
    product: ProductEntity;
}

// relationship

// 1. User can have multiple reviews
//  one-to-many
// user to review one-to-many

// 2. A product can have multiple reviews
