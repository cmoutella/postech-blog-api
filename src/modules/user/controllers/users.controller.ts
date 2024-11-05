import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { LoggingInterceptor } from '../../../shared/interceptors/logging.interceptor';
import {
  InterfaceUser,
  PublicInterfaceUser,
} from '../schemas/models/user.interface';
import { UserService } from '../services/user.service';
import { EncryptPasswordPipe } from '../pipe/password.pipe';
import { AuthGuard } from '../../../shared/guards/auth.guard';

import { z } from 'zod';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';
import { addMinutes } from 'date-fns';

const createUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  name: z.string(),
});

type CreateUser = z.infer<typeof createUserSchema>;

const updateUserSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  name: z.string().optional(),
});

type UpdateUser = z.infer<typeof updateUserSchema>;

@ApiTags('users')
@UseInterceptors(LoggingInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @UsePipes(new EncryptPasswordPipe())
  @UsePipes(new ZodValidationPipe(createUserSchema))
  @Post()
  async createUser(@Body() { username, password, name }: CreateUser) {
    return await this.userService.createUser({ username, password, name });
  }

  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @ApiBearerAuth()
  @Get(':username')
  async getByUsername(@Param('username') username: string) {
    const u = await this.userService.getByUsername(username);
    const user: PublicInterfaceUser = {
      id: u.id,
      username: u.username,
      name: u.name,
    };
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/id/:id')
  async getById(@Param('id') id: string) {
    const u = await this.userService.getById(id);
    const user: Omit<InterfaceUser, 'password'> = {
      id: u.id,
      username: u.username,
      name: u.name,
    };
    return user;
  }

  @ApiBearerAuth()
  @Post('/login')
  async authUser(@Body() credentials: InterfaceUser) {
    const { username, password } = credentials;

    const foundUser = await this.userService.getByUsername(username);
    const passwordMatch = await compare(password, foundUser.password);

    if (!passwordMatch) throw new Error('Username or password not matched');

    const authDate = new Date();
    const token = await this.jwtService.sign({ username: username });
    const tokenExpiration = addMinutes(authDate, 15);

    return {
      token: token,
      user: foundUser,
      expireAt: tokenExpiration.toISOString(),
    };
  }

  @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateUserSchema)) updateData: UpdateUser,
  ) {
    return await this.userService.updateUser(id, updateData);
  }

  @ApiBearerAuth()
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
  }
}
