import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { loggerConfig } from '@quests/common'
import { HeaderResolver } from 'nestjs-i18n'
import { I18nModule } from 'nestjs-i18n/dist/i18n.module'
import { LoggerModule } from 'nestjs-pino'
import * as path from 'node:path'
import { DataSource } from 'typeorm'
import { IConfig } from './common/types'
import appConfig from './config/app.config'
import databaseConfig from './config/database.config'
import externalConfig from './config/external.config'
import { TypeOrmConfigService } from './db/typeorm-config.service'
import { WalletsModule } from './wallets/wallets.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { ProtocolEthereumModule } from './protocols/protocol-ethereum/protocol-ethereum.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, loggerConfig, externalConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options!).initialize()

        return dataSource
      },
    }),
    I18nModule.forRootAsync({
      useFactory: (config: ConfigService<IConfig, true>) => ({
        fallbackLanguage: config.get('app.fallbackLanguage', { infer: true }),
        loaderOptions: {
          path: path.join(__dirname, '/assets/i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (config: ConfigService<IConfig, true>) => {
            return config.get('app.headerLanguage', { infer: true })
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<IConfig, true>) => {
        return { pinoHttp: config.get('logger', { infer: true }) }
      },
    }),
    AuthModule,
    UsersModule,
    WalletsModule,
    ProtocolEthereumModule,
  ],
  controllers: [],
})
export class AppModule {}
