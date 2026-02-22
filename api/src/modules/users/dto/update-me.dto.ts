import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class UpdateMeDto {
  @IsString()
  @MinLength(5)
  @MaxLength(120)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(11)
  @IsPhoneNumber('BR')
  phone?: string;

  @IsString()
  @MinLength(11)
  @MaxLength(14)
  cpf: string;

  @IsString()
  @MinLength(6)
  @MaxLength(60)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Senha muito fraca.',
  })
  password: string;
}
