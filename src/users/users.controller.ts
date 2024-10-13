/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { UserSignUpDto } from './dto/user.signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-login.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
// import { AuthorizeRoles } from 'src/utility/decorators/authorize-roles.decorator';
import { Roles } from 'src/utility/common/user-roles.enum';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // Auth related controller
    @Post('register')
    async signup(@Body() signupDto: UserSignUpDto): Promise<UserEntity> {
        return await this.usersService.signup(signupDto);
    }

    @Post('login')
    async login(@Body() signinDto: UserSignInDto): Promise<{
        user: UserEntity;
        accessToken: string;
    }> {
        const user = await this.usersService.login(signinDto);
        const accessToken = await this.usersService.accessToken(user);
        return { user, accessToken };
    }

    // @AuthorizeRoles([Roles.ADMIN])
    @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
    @Get('all-users')
    async getAllUsers(): Promise<UserEntity[]> {
        return await this.usersService.findAllUsers();
    }

    @Get('single/:id')
    async getUserById(@Param('id') id: string) {
        return await this.usersService.getUserById(+id);
    }

    @UseGuards(AuthenticationGuard)
    @Get('me')
    getProfile(@CurrentUser() currentUser: UserEntity) {
        return currentUser;
    }
}
