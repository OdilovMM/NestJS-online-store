/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserSignUpDto {
    @IsString({ message: 'Only strings are allowed' })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsString({ message: 'Only strings are allowed' })
    @IsNotEmpty({ message: 'Only a valid Email is allowed' })
    email: string;

    @IsString({ message: 'Only strings are allowed' })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(5, { message: 'Password must be at least 5 character' })
    @MaxLength(12, { message: 'Password should not exceed from 12 character' })
    password: string;
}
