import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common'

export const validationOptions: ValidationPipeOptions = {
  stopAtFirstError: true,
  forbidUnknownValues: false, // * should be true after the fix: https://github.com/typestack/class-validator/issues/1873
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) => {
    return new UnprocessableEntityException({
      errors: errors.reduce(
        (accumulator, currentValue) => ({
          ...accumulator,
          [currentValue.property]: Object.values(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            currentValue.constraints!,
          ).join(', '),
        }),
        {},
      ),
    })
  },
}
