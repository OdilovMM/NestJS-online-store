/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrdersProductsEntity } from './entities/orders-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(OrderEntity) private readonly orderRepo: Repository<OrderEntity>,
        @InjectRepository(OrdersProductsEntity) private readonly orderProductsRepo: Repository<OrdersProductsEntity>,
        @Inject(forwardRef(() => ProductsService)) private readonly productService: ProductsService
    ) {}

    async create(createOrderDto: CreateOrderDto, currentUser: UserEntity): Promise<OrderEntity> {
        const shippingEntity = new ShippingEntity();
        Object.assign(shippingEntity, createOrderDto.shippingAddress);
        const orderEntity = new OrderEntity();
        orderEntity.shippingAddress = shippingEntity;
        orderEntity.user = currentUser;

        const orderTbl = await this.orderRepo.save(orderEntity);

        let opEntity: {
            order: OrderEntity;
            product: ProductEntity;
            product_quantity: number;
            product_unit_price: number;
        }[] = [];

        for (let i = 0; i < createOrderDto.orderedProducts.length; i++) {
            const order = orderTbl;
            const product = await this.productService.findOne(createOrderDto.orderedProducts[i].id);
            const product_quantity = createOrderDto.orderedProducts[i].product_quantity;
            const product_unit_price = createOrderDto.orderedProducts[i].product_unit_price;
            opEntity.push({ order, product, product_quantity, product_unit_price });
        }

        const op = await this.orderProductsRepo.createQueryBuilder().insert().into(OrdersProductsEntity).values(opEntity).execute();

        return await this.findOne(orderTbl.id);
    }

    async findAll(): Promise<OrderEntity[]> {
        return await this.orderRepo.find({
            relations: {
                shippingAddress: true,
                user: true,
                products: { product: true }
            }
        });
    }

    async findOne(id: number): Promise<OrderEntity> {
        return await this.orderRepo.findOne({
            where: { id },
            relations: {
                shippingAddress: true,
                user: true,
                products: { product: true }
            }
        });
    }

    async update(id: number, updateOrderStatusDto: UpdateOrderStatusDto, currentUser: UserEntity) {
        let order = await this.findOne(id);
        if (!order) throw new NotFoundException('Order not found');

        if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELED) {
            throw new BadRequestException(`Order already is in ${order.status}`);
        }

        if (order.status === OrderStatus.PROCESSING && updateOrderStatusDto.status !== OrderStatus.SHIPPED) {
            throw new BadRequestException(`Delivery before shipped not possible `);
        }

        if (updateOrderStatusDto.status === OrderStatus.SHIPPED && order.status === OrderStatus.SHIPPED) {
            return order;
        }
        if (updateOrderStatusDto.status === OrderStatus.SHIPPED) {
            order.shippedAt = new Date();
        }
        if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
            order.deliveredAt = new Date();
        }
        order.status = updateOrderStatusDto.status;
        order.updatedBy = currentUser;
        order = await this.orderRepo.save(order);
        if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
            await this.stockUpdate(order, OrderStatus.DELIVERED);
        }

        return order;
    }

    async stockUpdate(order: OrderEntity, status: string) {
        for (const op of order.products) {
            await this.productService.updateStock(op.product.id, op.product_quantity, status);
        }
    }

    async cancelOrder(id: number, currentUser: UserEntity) {
        let order = await this.findOne(id);
        if (!order) {
            throw new NotFoundException('Order not found with that id');
        }
        if (order.status === OrderStatus.CANCELED) return order;

        order.status === OrderStatus.CANCELED;
        order.updatedBy = currentUser;
        order = await this.orderRepo.save(order);
        await this.stockUpdate(order, OrderStatus.CANCELED);
        return order;
    }

    async findOneByProductId(id: number) {
        return await this.orderProductsRepo.findOne({
            relations: { product: true },
            where: { product: { id: id } }
        });
    }
}
