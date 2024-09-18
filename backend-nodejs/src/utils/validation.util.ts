// Utility function to check for required fields
//eslint-disable-next-line
export const checkRequiredFields = (body: any, fields: string[]): string[] =>
  fields.filter((field) => !body[field])

//eslint-disable-next-line
export const validateRequiredFields = (body: any, fields: string[]) => {
  const missingFields = checkRequiredFields(body, fields)

  if (missingFields.length > 0) {
    return {
      valid: false,
      message: `The following fields are required: ${missingFields.join(', ')}`,
    }
  }

  return { valid: true, message: '' }
}
