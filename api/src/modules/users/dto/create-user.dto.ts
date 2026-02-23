import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';

export class CreateUserDto extends User {
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
  @IsOptional()
  @MinLength(6)
  @MaxLength(60)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too week.',
  })
  @ApiProperty({ example: '1234@ChangeIt' })
  password?: string;

  @IsString()
  @IsEnum(UserStatus)
  @ApiProperty({ example: UserStatus.ACTIVE, enum: UserStatus })
  status: string;
}
