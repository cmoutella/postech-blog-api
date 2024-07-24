import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { LoggingInterceptor } from '../../../shared/interceptors/logging.interceptor';
import { InterfaceUser } from '../schemas/models/user.interface';
import { UserService } from '../services/user.service';
import { EncryptPasswordPipe } from '../pipe/password.pipe';
import { AuthGuard } from '../../../shared/guards/auth.guard';

import { z } from 'zod';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';

const createUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type CreateUser = z.infer<typeof createUserSchema>;

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
  async createUser(@Body() { username, password }: CreateUser) {
    return await this.userService.createUser({ username, password });
  }

  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':username')
  async getByUsername(@Param('username') username: string) {
    const u = await this.userService.getByUsername(username);
    const user: Omit<InterfaceUser, 'password'> = {
      id: u.id,
      username: u.username,
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

    const token = await this.jwtService.sign({ username: username });

    return { token: token };
  }

  @ApiBearerAuth()
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
  }
}
