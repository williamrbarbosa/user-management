import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
  private readonly saltRounds = 10; // Define o número de rounds para hashing

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
