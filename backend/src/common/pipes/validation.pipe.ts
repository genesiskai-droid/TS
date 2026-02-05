import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

interface ValidationError {
  field: string;
  message: string;
}

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  transform(value: any): any {
    if (!value || typeof value !== 'object') {
      return value;
    }

    const errors: ValidationError[] = [];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    for (const [key, val] of Object.entries(value)) {
      if (val === undefined || val === null || val === '') {
        errors.push({
          field: key,
          message: `${key} is required`,
        });
      } else if (Array.isArray(val) && val.length === 0) {
        errors.push({
          field: key,
          message: `${key} cannot be empty`,
        });
      } else if (typeof val === 'string' && val.trim() === '') {
        errors.push({
          field: key,
          message: `${key} cannot be blank`,
        });
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors,
      });
    }

    return value;
  }
}
