import { ValidationPipe, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { validationOptions } from '@quests/common'
import { useContainer } from 'class-validator'
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { AppModule } from './app/app.module'
import { IConfig } from './app/common/types'

const getHttpsOptions = () => {
  const secretsDir = process.env.CONFIG_SECRETS_DIR!
  const appName = process.env.CONFIG_APP_NAME!

  return {
    ca: fs.readFileSync(path.join(secretsDir, appName, 'tls', 'CA.crt')),
    key: fs.readFileSync(path.join(secretsDir, appName, 'tls', 'app.key')),
    cert: fs.readFileSync(path.join(secretsDir, appName, 'tls', 'app.crt')),
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
    httpsOptions:
      process.env.NODE_ENV === 'development' ? undefined : getHttpsOptions(),
  })

  const logger = app.get(Logger)

  app.useLogger(logger)

  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  const configService = app.get(ConfigService<IConfig, true>)

  app.enableShutdownHooks()
  app.setGlobalPrefix(configService.get('app.apiPrefix', { infer: true }), {
    exclude: ['/'],
  })
  app.enableVersioning({ type: VersioningType.URI })
  app.useGlobalInterceptors(new LoggerErrorInterceptor())
  app.useGlobalPipes(new ValidationPipe(validationOptions))

  const options = new DocumentBuilder()
    .setTitle('Vencura API')
    .setDescription('Vencura Docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup('docs', app, document)

  await app.listen(configService.get('app.port', { infer: true }))
}

bootstrap()
