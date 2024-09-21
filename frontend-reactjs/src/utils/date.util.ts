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

export const formateDate = (date: string) => {
  if (!date) return ''

  //example: 04:30 PM
  return new Date(date).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export const formateDateTime = (date: string) => {
  if (!date) return ''

  //example: 04:30 PM
  return new Date(date).toLocaleTimeString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const isToday = (date: string) => {
  return new Date(date).toDateString() === new Date().toDateString()
}

export const isYesterday = (date: string) => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  return new Date(date).toDateString() === yesterday.toDateString()
}
