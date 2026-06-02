import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';

export class CreateUserDto {
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
    message: 'Password too weak.',
  })
  @ApiProperty({ example: '1234@ChangeIt', required: false })
  password?: string;

  @IsEnum(UserStatus)
  @IsOptional()
  @ApiProperty({ example: UserStatus.ACTIVE, enum: UserStatus, required: false })
  status?: UserStatus;
}
