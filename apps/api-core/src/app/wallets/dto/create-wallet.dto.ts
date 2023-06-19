import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsString, MaxLength, MinLength } from 'class-validator'

// todo: remove typeorm decorators from dto
export class CreateWalletDto {
  @ApiProperty({ example: 'myWallet' })
  @MinLength(3)
  @MaxLength(20)
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.toLowerCase().trim())
  name: string

  @ApiProperty({ example: 'ethereum' })
  @MinLength(3)
  @MaxLength(20)
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.toLowerCase().trim())
  protocol: string
}
