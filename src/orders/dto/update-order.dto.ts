/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '../enums/order-status.enum';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderStatusDto extends PartialType(CreateOrderDto) {
    @IsNotEmpty()
    @IsString()
    @IsIn([OrderStatus.SHIPPED, OrderStatus.DELIVERED])
    status: OrderStatus;
}
