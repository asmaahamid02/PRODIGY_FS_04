export const isDateLessThanHoursAgo = (date: string, hours: number = 24) => {
  if (date === '') return false

  const currentDate = new Date()
  const dateToCheck = new Date(date)

  const difference =
    (currentDate.getTime() - dateToCheck.getTime()) / (1000 * 60 * 60)

  return difference < hours
}

export const formateDateToHoursAndMinutes = (date: string) => {
  if (!date) return ''

  //example: 04:30 PM
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
