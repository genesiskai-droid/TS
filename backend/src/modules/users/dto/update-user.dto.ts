import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
