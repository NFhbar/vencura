import {
  Injectable,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ethers, JsonRpcProvider, TransactionRequest } from 'ethers'
import { IConfig } from '../../common/types/config'
import { EncryptionService } from '../../encryption/encryption.service'

@Injectable()
export class ProtocolEthereumService implements OnModuleInit {
  private readonly apiMap = new Map<'ethereum', JsonRpcProvider>()

  constructor(
    private readonly config: ConfigService<IConfig, true>,
    private readonly encryptionService: EncryptionService,
  ) {}

  private async _getApi(): Promise<JsonRpcProvider> {
    try {
      return new JsonRpcProvider(
        this.config.get('external.ethRpc', { infer: true }),
      )
    } catch (err) {
      throw new Error(`Could not initialize eth api}`)
    }
  }

  public async onModuleInit(): Promise<JsonRpcProvider> {
    const api = await this._getApi()
    this.apiMap.set('ethereum', api)
    return api
  }

  public async createEthWallet() {
    return ethers.Wallet.createRandom()
  }

  public async getEthWalletBalance(
    address: string,
  ): Promise<{ balance: string }> {
    const api = this.apiMap.get('ethereum')!
    const balance = await api.getBalance(address)
    return { balance: ethers.formatEther(balance) }
  }

  public async signMessage(
    mnemonic: string,
    message: string,
  ): Promise<{ signed_message: string }> {
    const decryptedMnemonic = this.encryptionService.decryptMnemonic(mnemonic)
    const wallet = ethers.Wallet.fromPhrase(decryptedMnemonic)
    const signed_message = await wallet.signMessage(message)
    return { signed_message }
  }

  public async send(mnemonic: string, amount: string, to: string) {
    const api = this.apiMap.get('ethereum')!
    const decryptedMnemonic = this.encryptionService.decryptMnemonic(mnemonic)
    const wallet = ethers.Wallet.fromPhrase(decryptedMnemonic, api)

    const nonce = await api.getTransactionCount(wallet.address, 'latest')
    const value = await ethers.parseEther(amount)
    console.log(value)
    const tx: TransactionRequest = {
      to,
      from: wallet.address,
      nonce,
      value,
    }
    let receipt
    try {
      receipt = await wallet.sendTransaction(tx)
    } catch (e) {
      throw new UnprocessableEntityException(e.code)
    }
    return receipt
  }
}
