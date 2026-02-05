import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;
}
