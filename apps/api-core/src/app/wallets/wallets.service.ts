import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseControllerService } from '@quests/common'
import { FindOneOptions, Repository } from 'typeorm'
import { EncryptionService } from '../encryption/encryption.service'
import { Wallet } from '../entities'
import { ProtocolEthereumService } from '../protocols/protocol-ethereum/protocol-ethereum.service'

@Injectable()
export class WalletsService extends BaseControllerService<Wallet> {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletsRepository: Repository<Wallet>,
    private readonly encryptionService: EncryptionService,
    private readonly protocolEthereumService: ProtocolEthereumService,
  ) {
    super(walletsRepository)
  }

  public async findOne(options: FindOneOptions<Wallet>) {
    const w = await this.walletsRepository.findOne(options)

    if (!w) {
      throw new NotFoundException('Wallet not found')
    }

    return w
  }

  public async createWallet(
    userId: number,
    name: string,
    protocol: string,
  ): Promise<Wallet> {
    const wallet = await this.protocolEthereumService.createEthWallet()
    const encryptedMnemonic = this.encryptionService.encryptMnemonic(
      wallet.mnemonic?.phrase,
    )
    return this.walletsRepository.save({
      user_id: userId,
      name,
      protocol,
      address: wallet.address,
      mnemonic: encryptedMnemonic,
    })
  }

  public async getBalance(address: string): Promise<{ balance: string }> {
    return this.protocolEthereumService.getEthWalletBalance(address)
  }

  public async signMessage(
    userId: number,
    address: string,
    message: string,
  ): Promise<{ signed_message: string }> {
    const wallet = await this.walletsRepository.findOne({
      where: {
        address,
        user_id: userId,
      },
    })
    if (!wallet) {
      throw new NotFoundException('Wallet not found')
    }
    return this.protocolEthereumService.signMessage(wallet.mnemonic, message)
  }

  public async send(
    userId: number,
    address: string,
    amount: string,
    to: string,
  ) {
    const wallet = await this.walletsRepository.findOne({
      where: {
        address,
        user_id: userId,
      },
    })
    if (!wallet) {
      throw new NotFoundException('Wallet not found')
    }
    return this.protocolEthereumService.send(wallet.mnemonic, amount, to)
  }
}
