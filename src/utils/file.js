export const getFileName = (url) => {
  return url?.split('/').reduce((pre, next, index) => {
    return index <= 3 ? pre : pre + next
  }, '')
}
