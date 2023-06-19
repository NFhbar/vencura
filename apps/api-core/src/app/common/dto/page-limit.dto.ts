import { Type } from 'class-transformer'
import { IsInt, Max, Min } from 'class-validator'

export class PageLimitDto {
  @Min(1)
  @IsInt()
  @Type(() => Number)
  page = 1

  @Min(1)
  @Max(50)
  @IsInt()
  @Type(() => Number)
  limit = 5
}
