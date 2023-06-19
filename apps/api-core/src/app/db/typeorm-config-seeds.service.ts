import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { IConfig, IDatabaseConfig } from '../common/types'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private readonly databaseConfig: IDatabaseConfig

  constructor(private readonly config: ConfigService<IConfig, true>) {
    this.databaseConfig = this.config.get('database', { infer: true })
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.databaseConfig.type,
      url: this.databaseConfig.url,
      host: this.databaseConfig.host,
      port: this.databaseConfig.port,
      username: this.databaseConfig.username,
      password: this.databaseConfig.password,
      database: this.databaseConfig.name,
      synchronize: this.databaseConfig.synchronize,
      dropSchema: false,
      keepConnectionAlive: true,
      logging: ['error'],
      entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/database/migrations',
        subscribersDir: 'subscriber',
      },
      extra: {
        // based on https://node-postgres.com/api/pool
        // max connection pool size
        max: this.databaseConfig.maxConnections,
        ssl: this.databaseConfig.sslEnabled
          ? {
              rejectUnauthorized: this.databaseConfig.rejectUnauthorized,
              ca: this.databaseConfig.ca,
              key: this.databaseConfig.key,
              cert: this.databaseConfig.cert,
            }
          : undefined,
      },
    } as TypeOrmModuleOptions
  }
}
