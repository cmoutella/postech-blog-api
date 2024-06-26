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
import { EncryptPasswordPipe } from '../pipe/password.pipe';

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

  @Post()
  async authUser(@Body() username: string, @Body() password: string) {
    return await this.userService.authUser(username, password);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    await this.userService.deleteUser(id);
  }
}
