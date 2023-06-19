import { registerAs } from '@nestjs/config'
import { IAppConfig } from '../common/types/config'

export default registerAs<IAppConfig>('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  name: process.env.APP_NAME,
  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3000,
  apiPrefix: process.env.API_PREFIX || 'api',
  fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
  headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
  jwt: process.env.APP_JWT_SECRET,
  expires: '60m',
  encryption: process.env.ENCRYPTION,
}))
