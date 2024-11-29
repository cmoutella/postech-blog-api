import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { InterfaceUser } from '../schemas/models/user.interface';

@Injectable()
export class EncryptPasswordPipe implements PipeTransform {
  constructor() {}

  async transform(body: InterfaceUser) {
    if (typeof body !== 'object' || !body.password) {
      throw new BadRequestException('Password is missing');
    }

    const { password } = body;
    try {
      const hashedPassword = await hash(password.toString(), 8);
      const transformed = { ...body, password: hashedPassword };

      return transformed;
    } catch (err) {
      throw new BadRequestException('Password format invalid');
    }
  }
}
