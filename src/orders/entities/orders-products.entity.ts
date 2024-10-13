/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from 'src/products/entities/product.entity';

@Entity({ name: 'orders-products' })
export class OrdersProductsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    product_quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    product_unit_price: number;

    @ManyToMany(() => OrderEntity, (order) => order.products)
    order: OrderEntity;

    @ManyToOne(() => ProductEntity, (prod) => prod.products, { cascade: true })
    product: ProductEntity;
}
