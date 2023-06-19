type AwaitedValues<T extends readonly unknown[]> = {
  -readonly [K in keyof T]: Awaited<T[K]>
}
type MaybeValues<T extends readonly unknown[]> = {
  [K in keyof T]: T[K] | undefined
}

function settledValueOrUndefined<T, R extends PromiseSettledResult<T>>(
  result: R,
): T | undefined {
  return result.status === 'fulfilled' ? result.value : undefined
}

export async function settleAll<T extends readonly PromiseLike<any>[]>(
  promises: T,
): Promise<MaybeValues<AwaitedValues<T>>> {
  return (await Promise.allSettled(promises)).map(
    settledValueOrUndefined,
  ) as MaybeValues<AwaitedValues<T>>
}
