import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../../../entities'
import { users } from '../data'

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async run() {
    await this.usersRepository.save(this.usersRepository.create(users))
  }
}
