import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AxiosError } from 'axios'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { catchError, firstValueFrom } from 'rxjs'
import { IConfig } from '../common/types'

@Injectable()
export class CoinapiService {
  constructor(
    @InjectPinoLogger(CoinapiService.name)
    private readonly logger: PinoLogger,

    private readonly httpService: HttpService,
    private readonly config: ConfigService<IConfig, true>,
  ) {}

  public async getETHPrice(time: string): Promise<any> {
    const url = `https://rest.coinapi.io/v1/exchangerate/ETH/USD?${time}`

    const headers = {
      'X-CoinAPI-Key': this.config.get('external.ethRpc', {
        infer: true,
      }),
    }

    const { data } = await firstValueFrom(
      this.httpService.get(url, { headers }).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error)
          throw new BadRequestException('Eth price failed.')
        }),
      ),
    )
    return data
  }
}
