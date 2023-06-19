import * as Nest from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { PageLimitDto } from '../common/dto'
import { IUserAuthPayload } from '../common/types'
import { WalletsService } from './wallets.service'
import { User as ReqUser } from '../common/decorators'
import { CreateWalletDto } from './dto/create-wallet.dto'
import { GetBalanceDto } from './dto/get-balance.dto'
import { SignMessageDto } from './dto/sign-message.dto'
import { SendDto } from './dto/send.dto'

@ApiTags('Wallets')
@ApiBearerAuth()
@Nest.Controller({ path: 'wallets', version: '1' })
@Nest.UseGuards(AuthGuard('jwt'))
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Nest.Get()
  @Nest.HttpCode(Nest.HttpStatus.OK)
  async findAll(
    @ReqUser() user: IUserAuthPayload,
    @Nest.Query() { page, limit }: PageLimitDto,
  ) {
    return this.walletsService.findManyWithPagination(
      {
        where: {
          user_id: user.id,
        },
      },
      { page, limit },
    )
  }

  @Nest.Get('/:address/balance')
  @Nest.HttpCode(Nest.HttpStatus.OK)
  async findOne(@Nest.Param() { address }: GetBalanceDto) {
    return this.walletsService.getBalance(address)
  }

  @Nest.Post()
  @Nest.HttpCode(Nest.HttpStatus.OK)
  async createWallet(
    @ReqUser() user: IUserAuthPayload,
    @Nest.Body() { name, protocol }: CreateWalletDto,
  ) {
    return this.walletsService.createWallet(user.id, name, protocol)
  }

  @Nest.Post('/:address/sign')
  @Nest.HttpCode(Nest.HttpStatus.OK)
  async signMessage(
    @ReqUser() user: IUserAuthPayload,
    @Nest.Param() { address }: GetBalanceDto,
    @Nest.Body() { message }: SignMessageDto,
  ) {
    return this.walletsService.signMessage(user.id, address, message)
  }

  @Nest.Post('/:address/send')
  @Nest.HttpCode(Nest.HttpStatus.OK)
  async send(
    @ReqUser() user: IUserAuthPayload,
    @Nest.Param() { address }: GetBalanceDto,
    @Nest.Body() { amount, to }: SendDto,
  ) {
    return this.walletsService.send(user.id, address, amount, to)
  }
}
