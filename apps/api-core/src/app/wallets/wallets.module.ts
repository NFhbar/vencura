import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Wallet } from '../entities'
import { WalletsController } from './walllets.controller'
import { WalletsService } from './wallets.service'
import { EncryptionService } from '../encryption/encryption.service'
import { ProtocolEthereumService } from '../protocols/protocol-ethereum/protocol-ethereum.service'

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  controllers: [WalletsController],
  providers: [WalletsService, EncryptionService, ProtocolEthereumService],
  exports: [WalletsService],
})
export class WalletsModule {}
