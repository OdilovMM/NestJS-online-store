/* eslint-disable prettier/prettier */
import { Exclude } from 'class-transformer';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { Roles } from 'src/utility/common/user-roles.enum';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, Timestamp, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    @Exclude()
    password: string;

    @Column({ type: 'json', default: JSON.stringify([Roles.USER]) })
    roles: Roles[];

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    // one-to-many ==> categories
    @OneToMany(() => CategoryEntity, (category) => category.addedBy)
    categories: CategoryEntity[];

    // one-to-many ==> categories
    @OneToMany(() => ProductEntity, (prod) => prod.addedBy)
    products: ProductEntity[];

    @OneToMany(() => ReviewEntity, (rev) => rev.user)
    reviews: ReviewEntity;

    @OneToMany(() => OrderEntity, (order) => order.updatedBy)
    ordersUpdateBy: OrderEntity[];

    @OneToMany(() => OrderEntity, (order) => order.user)
    orders: OrderEntity;
}
