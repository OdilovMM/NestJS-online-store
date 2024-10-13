/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShippingDto {
    @IsNotEmpty({ message: 'Phone should not be empty' })
    @IsString({ message: 'Phone only string type' })
    phone: string;

    @IsOptional()
    @IsString({ message: 'Name only string type' })
    name: string;

    @IsNotEmpty({ message: 'Address should not be empty' })
    @IsString({ message: 'Address only string type' })
    address: string;

    @IsNotEmpty({ message: 'City should not be empty' })
    @IsString({ message: 'City only string type' })
    city: string;

    @IsNotEmpty({ message: 'Post code should not be empty' })
    @IsString({ message: 'Post code only string type' })
    postcode: string;

    @IsNotEmpty({ message: 'State should not be empty' })
    @IsString({ message: 'State only string type' })
    state: string;

    @IsNotEmpty({ message: 'Country should not be empty' })
    @IsString({ message: 'Country only string type' })
    country: string;
}
