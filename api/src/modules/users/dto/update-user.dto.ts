import { IsString, IsEnum } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { UserStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends CreateUserDto {
  @IsString()
  @IsEnum(UserStatus)
  @ApiProperty({ example: 'ACTIVE' })
  status: string;
}
