import { Module } from '@nestjs/common'
import { EncryptionService } from '../../encryption/encryption.service'
import { ProtocolEthereumService } from './protocol-ethereum.service'

@Module({
  imports: [],
  controllers: [],
  providers: [EncryptionService, ProtocolEthereumService],
  exports: [ProtocolEthereumService],
})
export class ProtocolEthereumModule {}
