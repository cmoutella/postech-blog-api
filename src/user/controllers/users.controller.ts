import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';
import { InterfaceUser } from '../schemas/models/user.interface';
import { UserService } from '../services/user.service';
import { EncryptPasswordPipe, SignInPipe } from '../pipe/password.pipe';

@UseInterceptors(LoggingInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new EncryptPasswordPipe())
  @Post()
  async createUser(@Body() newUser: InterfaceUser) {
    return await this.userService.createUser(newUser);
  }

  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get(':username')
  async getByUsername(@Param('username') username: string) {
    return await this.userService.getByUsername(username);
  }

  @UsePipes(new SignInPipe())
  @Post('/login')
  async authUser(@Body() credentials: InterfaceUser) {
    return credentials;
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    await this.userService.deleteUser(id);
  }
}
