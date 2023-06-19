import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseControllerService } from '@quests/common'
import axios from 'axios'
import { FindOneOptions, Repository } from 'typeorm'
import { IConfig } from '../common/types'
import { User } from '../entities'

@Injectable()
export class UsersService extends BaseControllerService<User> {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly config: ConfigService<IConfig, true>,
  ) {
    super(usersRepository)
  }

  public async findOne(options: FindOneOptions<User>) {
    const user = await this.usersRepository.findOne(options)

    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  public async fintTotalRewardsForUser(userId: number) {
    const userEthReward = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.quest_completions', 'quest_completion')
      .leftJoin('quest_completion.quest', 'quest')
      .select('SUM(quest.eth_reward) AS total_eth_rewards')
      .where('user.id = :userId', { userId })
      .getRawOne()
    return userEthReward
  }

  public async fintTotalRewardsForUserUSD(userId: number) {
    const userQuests = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.quest_completions', 'quest_completion')
      .leftJoinAndSelect('quest_completion.quest', 'quest')
      .select([
        'user.id',
        'quest.id',
        'quest.name',
        'quest.eth_reward',
        'quest_completion.completed_at',
      ])
      .where('user.id = :userId', { userId })
      .getRawMany()

    if (userQuests.length === 0 || userQuests[0].quest_id === null) {
      return {
        quests: 0,
        totalUsdValue: 0,
      }
    }

    const ethPricePromises = userQuests.map(async (quest) => {
      console.log('QUEST', quest)
      const date = quest.quest_completion_completed_at
        .toISOString()
        .split('T')[0]
      const url = `https://rest.coinapi.io/v1/exchangerate/ETH/USD?${date}`

      const headers = {
        'X-CoinAPI-Key': this.config.get('external.ethRpc', {
          infer: true,
        }),
      }
      const response = await axios.get(url, { headers })
      return response.data.rate
    })
    const ethPrices = await Promise.all(ethPricePromises)

    const completedQuestsWithEthPrice = userQuests.map((quest, index) => {
      const ethRewardInUsd = Number(quest.quest_eth_reward) * ethPrices[index]
      return {
        ...quest,
        completed_at: quest.quest_completion_completed_at.toISOString(),
        ethPriceAtCompletionTime: ethPrices[index],
        ethRewardInUsd,
      }
    })
    const totalUsdValue = completedQuestsWithEthPrice
      .reduce((total, quest) => total + quest.ethRewardInUsd, 0)
      .toFixed(2)

    return {
      quests: completedQuestsWithEthPrice,
      totalUsdValue,
    }
  }
}
