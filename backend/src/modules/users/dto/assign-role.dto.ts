import { IsEnum } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class AssignRoleDto {
  @IsEnum(Role)
  role: Role;
}
