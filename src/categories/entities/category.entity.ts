/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { ProductEntity } from 'src/products/entities/product.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class CategoryEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    title: string;

    @ApiProperty()
    @Column()
    description: string;

    @CreateDateColumn()
    createdAt: Timestamp;
    
    @UpdateDateColumn()
    updatedAt: Timestamp;

    // relationship
    // many-to-one  ==> user
    @ManyToOne(() => UserEntity, (user) => user.categories)
    addedBy: UserEntity;

    // one-to-many ==> categories
    @OneToMany(() => ProductEntity, (prod) => prod.category)
    products: ProductEntity[];
}
