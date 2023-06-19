import { IBaseConfig } from '@quests/common'

export interface IAppConfig {
  nodeEnv?: string
  name?: string
  port: number
  apiPrefix: string
  fallbackLanguage: string
  headerLanguage: string
  jwt?: string
  expires: string
  encryption?: string
}

export interface IDatabaseConfig {
  url?: string
  type?: string
  host?: string
  port: number
  password?: string
  name?: string
  username?: string
  synchronize: boolean
  maxConnections: number
  sslEnabled: boolean
  rejectUnauthorized: boolean
  ca?: string
  key?: string
  cert?: string
}

export interface IConfig extends IBaseConfig {
  app: IAppConfig
  database: IDatabaseConfig
  external: IExternalConfig
}

export interface IExternalConfig {
  ethRpc?: string
}

export interface CoinApiRespose {
  time: string
  asset_id_base: string
  asset_id_quote: string
  rate: number
}
