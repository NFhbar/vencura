interface User {
  id: number
  username: string
}

export const users: User[] = []
for (let i = 1; i <= 1000; i++) {
  const user = { id: i, username: `user${i}.eth` }
  users.push(user)
}

// export const usersGenerator = (amount: number): User[] => {
//   const users: User[] = []
//   for (let i = 1; i <= amount; i++) {
//     const user = { id: i, username: `user${i}.eth` }
//     users.push(user)
//   }
//   return users
// }
