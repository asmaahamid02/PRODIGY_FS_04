//eslint-disable-next-line
export const validateRequiredFields = (body: any, fields: string[]) => {
  fields.forEach((field) => {
    if (!body[field]) {
      throw new Error(`${field} is required`)
    }
  })
}

//eslint-disable-next-line
export const validateGroupRequest = (data: any, requiredFields: string[]) => {
  const { name, users } = data

  requiredFields.forEach((field) => {
    if (!data[field]) {
      throw new Error(`${field} is required`)
    }
  })

  if (name.trim().length < 3) {
    throw new Error('Group name must be at least 3 characters')
  }

  if (!users || users.length < 2) {
    throw new Error('Group must have at least 2 users')
  }
}
