import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
} from 'typeorm'
import { Wallet } from './wallet.entity'
import { EntityHelper } from './entity-helper'

@Entity('users')
@Unique(['username'])
export class User extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  password: string

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[]
}
