/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty()
    @IsString({ message: 'Only strings are allowed' })
    @IsNotEmpty({ message: 'Title is required' })
    title: string;

    @ApiProperty()
    @IsString({ message: 'Only strings are allowed' })
    @IsNotEmpty({ message: 'description is required' })
    description: string;
}
