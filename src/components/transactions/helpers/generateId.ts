export const generateId = () => {
  const array = new Uint32Array(1)
  globalThis.crypto.getRandomValues(array)
  return Number(`${Date.now()}${array[0]}`)
}
