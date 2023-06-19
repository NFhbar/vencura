export const deepMapObject = (data: any, callback: any) => {
  const map = (value: any, key: any) => {
    if (value !== undefined && value !== null && typeof value === 'object') {
      callback(value, key)
    }

    // eslint-disable-next-line no-empty
    if (value === undefined || value === null) {
    } else if (typeof value === 'object') {
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          map(value[i], i)
        }
      } else {
        for (const k in value) {
          map(value[k], k)
        }
      }
    }
  }

  map(data, undefined)

  return data
}
