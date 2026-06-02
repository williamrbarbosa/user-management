import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestBody {
  @IsEmail()
  @ApiProperty({ example: 'john.doe@gmail.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: '123@Mudar' })
  password: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: false, required: false })
  rememberme: boolean = false;
}
