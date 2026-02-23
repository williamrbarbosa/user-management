import {
  IsString,
  IsEnum,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';
import { UserStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends User {
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  @ApiProperty({ example: 'John' })
  first_name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(40)
  @ApiProperty({ example: 'Doe' })
  last_name: string;

  @IsEmail()
  @ApiProperty({ example: 'john.doe@gmail.com' })
  email: string;

  @IsString()
  @IsEnum(UserStatus)
  @ApiProperty({ example: UserStatus.ACTIVE, enum: UserStatus })
  status: string;
}
