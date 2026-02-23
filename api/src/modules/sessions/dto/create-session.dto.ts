import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export class CreateSessionDto {
  @IsUUID()
  @ApiProperty({ example: uuidv4() })
  user_id: string;
}
