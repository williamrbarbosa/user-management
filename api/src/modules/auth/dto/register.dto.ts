import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
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
  @MinLength(6)
  @MaxLength(60)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too week.',
  })
  @ApiProperty({ example: '123@Mudar' })
  user_password: string;

  @IsString()
  @MinLength(6)
  @MaxLength(60)
  @ApiProperty({ example: '123@Mudar' })
  user_confirm_password: string;
}
