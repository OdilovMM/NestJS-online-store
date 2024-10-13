/* eslint-disable prettier/prettier */

import { Type } from 'class-transformer';
import { CreateShippingDto } from './create-shipping.dto';
import { ValidateNested } from 'class-validator';
import { OrderProductsDto } from './order-products.dto';

export class CreateOrderDto {
    @Type(() => CreateShippingDto)
    @ValidateNested()
    shippingAddress: CreateShippingDto;

    @Type(() => OrderProductsDto)
    @ValidateNested()
    orderedProducts: OrderProductsDto[];
}
