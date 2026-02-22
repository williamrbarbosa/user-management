import { IsUUID } from 'class-validator';
import { Session } from '../entities/session.entity';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export class CreateSessionDto extends Session {
  @IsUUID()
  @ApiProperty({ example: uuidv4() })
  user_id: string;
}
