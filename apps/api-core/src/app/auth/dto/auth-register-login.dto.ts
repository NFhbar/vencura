import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export class AuthRegisterLoginDto {
  @ApiProperty({ type: String, example: 'dynamic' })
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  username: string

  @ApiProperty({ type: String, example: '2N3gYXC4r82j8#%2' })
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(30)
  password: string
}
