import { BadRequestException, PipeTransform } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { InterfaceUser } from '../schemas/models/user.interface';
import { UserService } from '../services/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserMongooseRepository } from '../repositories/mongoose/user.mongoose.repository';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

export class EncryptPasswordPipe implements PipeTransform {
  constructor() {}

  async transform(body: InterfaceUser) {
    const { username, password } = body;
    try {
      const hashedPassword = await hash(password, 8);
      return { username: username, password: hashedPassword };
    } catch (err) {
      throw new BadRequestException('Password format invalid');
    }
  }
}

export class SignInPipe implements PipeTransform {
  constructor() {}

  jwtService = new JwtService();
  userRepository = new UserMongooseRepository(new Model<User>());

  async transform(body: InterfaceUser) {
    console.log('body', body);
    const { username, password } = body;
    try {
      const user = await this.userRepository.getByUsername(username);
      console.log('found user', user);

      if (!user) throw new Error();

      const passwordMatch = await compare(password, user.password);

      console.log('passwordMatch', passwordMatch);
      if (!passwordMatch) throw new Error();

      const token = await this.jwtService.sign({ username });
      console.log('token', token);

      return token;
    } catch (err) {
      throw new BadRequestException('Usuário e/ou Senha inválidos');
    }
  }
}
