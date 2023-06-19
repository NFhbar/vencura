export * from './validation-options'

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))
