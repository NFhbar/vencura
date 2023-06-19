import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export class SignMessageDto {
  @ApiProperty({
    example: 'message',
  })
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  message: string
}
