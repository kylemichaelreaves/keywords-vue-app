export const safelyGenerateRandomNumber = (): number => {
  const array = new Uint32Array(1)
  globalThis.crypto.getRandomValues(array)
  return array[0]!
}
