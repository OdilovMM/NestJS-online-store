/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class OrderProductsDto {
    @IsNotEmpty({ message: 'Product can not be empty' })
    id: number;

    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price should be number' })
    @IsPositive({ message: 'Price can not be negative' })
    product_unit_price: number;

    @IsNumber({}, { message: 'Product quantity should be number' })
    @IsPositive({ message: 'Product quantity can not be negative' })
    product_quantity: number;
}
