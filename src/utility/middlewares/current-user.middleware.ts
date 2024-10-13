/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

// In order to get the access to the currentUser in the request
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            currentUser?: UserEntity;
        }
    }
}

interface JwtPayload {
    id: string;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UsersService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
            req.currentUser = null;
            next();
            return;
        } else {
            try {
                const token = authHeader.split(' ')[1];
                const { id } = <JwtPayload>verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
                const currentUser = await this.usersService.getUserById(+id);
                req.currentUser = currentUser;
                next();
            } catch (error) {
                req.currentUser = null;
                next();
            }
        }
    }
}
