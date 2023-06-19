import { faker } from '@faker-js/faker'

interface QuestCompletion {
  id: number
  user_id: number
  quest_id: number
  completed_at: Date
}

export const questsCompletions: QuestCompletion[] = []
for (let i = 1; i <= 1000; i++) {
  const quest = {
    id: i,
    user_id: faker.number.int({ min: 1, max: 1000 }),
    quest_id: faker.number.int({ min: 1, max: 500 }),
    completed_at: faker.date.past(),
  }
  questsCompletions.push(quest)
}
