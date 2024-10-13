/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignUpDto } from './dto/user.signup.dto';
import { compare, hash } from 'bcrypt';
import { UserSignInDto } from './dto/user-login.dto';
import { instanceToInstance } from 'class-transformer';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>) {}

    // searching for user by email
    async findByEmail(email: string, includePassword = false) {
        switch (includePassword) {
            case true:
                return await this.usersRepo.findOne({
                    where: { email },
                    select: ['id', 'email', 'password', 'roles', 'name', 'createdAt', 'updatedAt']
                });

            case false:
            default:
                return await this.usersRepo.findOne({
                    where: { email }
                });
        }
    }

    async accessToken(user: UserEntity): Promise<string> {
        if (!process.env.ACCESS_TOKEN_SECRET_KEY) {
            throw new Error('ACCESS_TOKEN_SECRET_KEY is not defined');
        }
        return sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: process.env.ACCESS_TOKEN_SECRET_KEY_EXPIRESIN
        });
    }

    async signup(userSignupDto: UserSignUpDto): Promise<UserEntity> {
        const existUser = await this.findByEmail(userSignupDto.email);
        if (existUser) {
            throw new BadRequestException('Email already in use');
        }
        userSignupDto.password = await hash(userSignupDto.password, 12);
        // use nestjs serialize data in order to delete the password from the response
        const user = this.usersRepo.create(userSignupDto);
        return await this.usersRepo.save(user);
    }

    async login(signinDto: UserSignInDto) {
        // a. look for exist user
        const existUser = await this.findByEmail(signinDto.email, true);
        if (!existUser) throw new BadRequestException('User not found');

        // b. compare passwords
        const isMatchPassword = await compare(signinDto.password, existUser.password);

        if (!isMatchPassword) throw new BadRequestException('Invalid credentials');
        const userWithoutPassword = instanceToInstance(existUser);
        return userWithoutPassword;
    }

    async findAllUsers(): Promise<UserEntity[]> {
        return await this.usersRepo.find();
    }

    async getUserById(id: number) {
        return await this.usersRepo.findOneBy({ id });
    }
}
