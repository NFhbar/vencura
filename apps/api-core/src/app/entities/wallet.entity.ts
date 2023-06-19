import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { User } from './user.entity'
import { EntityHelper } from './entity-helper'

@Entity('wallets')
export class Wallet extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  user_id: number

  @Column()
  name: string

  @Column()
  protocol: string

  @Index()
  @Column()
  address: string

  @Column()
  mnemonic: string

  @ManyToOne(() => User, (user) => user.wallets)
  @JoinColumn({ name: 'user_id' })
  user: User
}
