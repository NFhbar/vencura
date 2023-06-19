import { registerAs } from '@nestjs/config'
import { IExternalConfig } from '../common/types/config'

export default registerAs<IExternalConfig>('external', () => ({
  ethRpc: process.env.ETH_RPC,
}))
