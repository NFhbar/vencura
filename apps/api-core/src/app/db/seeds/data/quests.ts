import { faker } from '@faker-js/faker'

interface Quest {
  id: number
  name: string
  eth_reward: number
}

export const quests: Quest[] = []
for (let i = 1; i <= 500; i++) {
  const quest = {
    id: i,
    name: faker.lorem.words(3),
    eth_reward: parseFloat(faker.finance.amount(0.01, 600, 2)),
  }
  quests.push(quest)
}
