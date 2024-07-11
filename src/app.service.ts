import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to FIAP Tech Challenge API used for blog posts!';
  }
}
