import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { IConfig, IDatabaseConfig } from '../common/types'

const importAllFunctions = (
  requireContext: __WebpackModuleApi.RequireContext,
) =>
  requireContext
    .keys()
    .sort()
    .map((filename) => {
      const required = requireContext(filename)

      return Object.keys(required).reduce((result, exportedKey) => {
        const exported = required[exportedKey]

        if (typeof exported === 'function') {
          return result.concat(exported)
        }

        return result
      }, [])
    })
    .flat()

const entitiesViaWebpack: NonNullable<EntitiesAndMigrationsOpts['entities']> =
  importAllFunctions(require.context('../entities', true, /\.entity\.ts$/))

const migrationsViaWebpack: NonNullable<
  EntitiesAndMigrationsOpts['migrations']
> = importAllFunctions(require.context('./migrations', true, /\.ts$/))

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
      entities: entitiesViaWebpack,
      migrations: migrationsViaWebpack,
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

type EntitiesAndMigrationsOpts = Pick<
  TypeOrmModuleOptions,
  'entities' | 'migrations'
>
