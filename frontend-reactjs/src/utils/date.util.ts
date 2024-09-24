import moment from 'moment'

export const isDateLessThanHoursAgo = (date: string, hours: number = 24) => {
  if (date === '') return false

  return moment().diff(moment(date), 'hours') < hours
}

export const formatDate = (date: string) => {
  if (!date) return ''

  const today = moment().startOf('day')
  const inputDate = moment(date).startOf('day')

  const diffInDays = today.diff(inputDate, 'days')

  if (diffInDays === 0) {
    return 'Today'
  } else if (diffInDays === 1) {
    return 'Yesterday'
  } else if (diffInDays < 7) {
    return inputDate.format('dddd') // Day name
  } else {
    return inputDate.format('YYYY-MM-DD') // Display as date
  }
}
