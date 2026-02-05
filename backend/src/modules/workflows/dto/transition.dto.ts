import { IsString } from 'class-validator';

export class TransitionDto {
  @IsString()
  from: string;

  @IsString()
  to: string;
}
