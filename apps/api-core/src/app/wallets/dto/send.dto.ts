import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class SendDto {
  @ApiProperty({
    example: '0.1',
  })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  amount: string

  @ApiProperty({
    example: '5EwTiRt7vekWDPs8BHTAmhM5MkEPQ7xhZF4p1NUztoobsjtd',
  })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  to: string
}
