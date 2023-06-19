import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { CoinapiService } from './coinapi.service'

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [CoinapiService],
  exports: [CoinapiService],
})
export class CoinapiModule {}
