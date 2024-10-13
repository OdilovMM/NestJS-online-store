/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
    @IsNotEmpty({ message: 'Review can not be empty' })
    @IsNumber({}, { message: 'ProductId must be numeric' })
    productId: number;

    @IsNotEmpty({ message: 'Must have a ratings' })
    @IsNumber()
    ratings: number;

    @IsNotEmpty({ message: 'Cannot be empty' })
    @IsString()
    comment: string;
}
