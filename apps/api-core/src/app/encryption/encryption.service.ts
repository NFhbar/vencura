import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as crypto from 'crypto-js'
import { IConfig } from '../common/types'

@Injectable()
export class EncryptionService {
  constructor(private readonly config: ConfigService<IConfig, true>) {}

  encryptMnemonic(mnemonic: string | undefined) {
    return crypto.AES.encrypt(
      mnemonic,
      this.config.get('app.encryption', { infer: true }),
    ).toString()
  }

  decryptMnemonic(encodedMnemonic: string) {
    const buffer = crypto.AES.decrypt(
      encodedMnemonic,
      this.config.get('app.encryption', { infer: true }),
    )
    return buffer.toString(crypto.enc.Utf8)
  }
}
