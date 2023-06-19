import * as Nest from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { PageLimitDto } from '../common/dto'
import { UsersService } from './users.service'

@ApiTags('Users')
@ApiBearerAuth()
@Nest.Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Nest.Get()
  @Nest.HttpCode(Nest.HttpStatus.OK)
  async findAll(@Nest.Query() { page, limit }: PageLimitDto) {
    return this.usersService.findManyWithPagination({}, { page, limit })
  }

  @Nest.Get(':id')
  @Nest.HttpCode(Nest.HttpStatus.OK)
  async findOne(@Nest.Param('id') id: number) {
    return this.usersService.findOne({ where: { id } })
  }

  @Nest.Get(':id/total-rewards-eth')
  @Nest.HttpCode(Nest.HttpStatus.OK)
  async fintTotalRewardsForUser(@Nest.Param('id') id: number) {
    return this.usersService.fintTotalRewardsForUser(id)
  }

  @Nest.Get(':id/total-rewards-usd')
  @Nest.HttpCode(Nest.HttpStatus.OK)
  async fintTotalRewardsForUserUSD(@Nest.Param('id') id: number) {
    return this.usersService.fintTotalRewardsForUserUSD(id)
  }
}
