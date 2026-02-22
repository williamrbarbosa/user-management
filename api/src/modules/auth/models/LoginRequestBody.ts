import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginRequestBody {
  @IsString()
  @MinLength(10)
  @MaxLength(60)
  email: string;

  @IsString()
  password: string;

  @IsBoolean()
  @IsOptional()
  rememberme: boolean = false;
}
