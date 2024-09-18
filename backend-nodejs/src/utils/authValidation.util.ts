import { EGender, IUserBody } from '../types/user.type'
import { Request } from 'express'
import { validateRequiredFields } from './validation.util'

// Utility function to validate username format
const validateUsername = (
  username: string
): { valid: boolean; message?: string } => {
  const usernameRegex = /^[a-zA-Z0-9]{5,20}$/
  if (!usernameRegex.test(username)) {
    return {
      valid: false,
      message: 'Invalid username. Must contain 5-20 alphanumeric characters.',
    }
  }
  return { valid: true }
}

// Utility function to validate password format
const validatePassword = (
  password: string
): { valid: boolean; message?: string } => {
  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
  if (!passwordRegex.test(password)) {
    return {
      valid: false,
      message:
        'Invalid password. Must be 8-20 characters long and include uppercase, lowercase, number, and special character.',
    }
  }
  return { valid: true }
}

// Utility function to check if passwords match
const passwordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword
}

// Utility function to validate gender against enum
const validateGender = (
  gender: string,
  validGenders: string[]
): { valid: boolean; message?: string } => {
  if (!validGenders.includes(gender)) {
    return {
      valid: false,
      message: `Invalid gender. Allowed values are: ${validGenders.join(', ')}`,
    }
  }
  return { valid: true }
}

export const validateSignup: (req: Request) => {
  valid: boolean
  message: string
} = (req: Request) => {
  const requiredFields = [
    'fullName',
    'username',
    'password',
    'confirmPassword',
    'gender',
  ]

  const validateRequiredFieldsResponse = validateRequiredFields(
    req.body,
    requiredFields
  )

  if (!validateRequiredFieldsResponse.valid) {
    return validateRequiredFieldsResponse
  }

  const { username, password, confirmPassword, gender }: IUserBody = req.body

  const usernameValidation = validateUsername(username)
  if (!usernameValidation.valid) {
    return { valid: false, message: usernameValidation.message! }
  }

  const passwordValidation = validatePassword(password)
  if (!passwordValidation.valid) {
    return { valid: false, message: passwordValidation.message! }
  }

  if (!passwordsMatch(password, confirmPassword)) {
    return {
      valid: false,
      message: 'Passwords do not match!',
    }
  }

  const genderValidation = validateGender(gender, Object.values(EGender))
  if (!genderValidation.valid) {
    return { valid: false, message: genderValidation.message! }
  }

  return { valid: true, message: 'Validation successful' }
}
