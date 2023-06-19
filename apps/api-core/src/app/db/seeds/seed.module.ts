import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import appConfig from '../../config/app.config'
import databaseConfig from '../../config/database.config'
import { TypeOrmConfigService } from '../typeorm-config-seeds.service'
import { UserSeedModule } from './user/user-seed.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options!).initialize()

        return dataSource
      },
    }),
    UserSeedModule,
  ],
})
export class SeedModule {}
