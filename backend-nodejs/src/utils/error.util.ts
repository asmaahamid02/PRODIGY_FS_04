export const getErrorMessage = (error: unknown, prefix: string = '') => {
  if (error instanceof Error) {
    return `${prefix}${prefix ? ': ' : ''}${error.message}`
  } else {
    return `${prefix}${prefix ? ': ' : ''}An unknown error occurred.`
  }
}
