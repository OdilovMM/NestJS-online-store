/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class UserSignInDto {
    @IsString({ message: 'Only strings are allowed' })
    @IsNotEmpty({ message: 'Only a valid Email is allowed' })
    email: string;

    @IsString({ message: 'Only strings are allowed' })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}
