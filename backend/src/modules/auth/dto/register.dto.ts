import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  /**
   * Rol opcional:
   * - si no se envía, el backend puede asignar CLIENTE por defecto
   * - solo ADMIN/MANAGER deberían poder setear roles distintos
   */
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
