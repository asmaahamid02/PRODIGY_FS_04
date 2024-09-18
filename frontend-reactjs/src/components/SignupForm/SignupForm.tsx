import { Field, Form, Formik, FormikHelpers } from 'formik'
import usePasswordVisibility from '../../hooks/usePasswordVisibility'
import * as Yup from 'yup'
import TextInput from '../inputs/TextInput'
import { FaKey, FaUser } from 'react-icons/fa'
import PasswordAdornment from '../utils/PasswordAdornment'
import { EGender, ISignupFormValues } from './types'

const signupValidationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  username: Yup.string()
    .required('Username is required')
    .min(5)
    .max(20)
    .matches(
      /^[a-zA-Z0-9]+$/,
      'Username must contain only letters, or numbers!'
    ),
  password: Yup.string()
    .required('Password is required')
    .min(8)
    .max(20)
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password must contain at least one uppercase, one lowercase, one number, and one special character!'
    ),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
})

const LoginForm = () => {
  const { visible: showPassword, toggle: togglePassword } =
    usePasswordVisibility()
  const { visible: showConfirmPassword, toggle: toggleConfirmPassword } =
    usePasswordVisibility()

  const initialValues: ISignupFormValues = {
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: EGender.Male,
    profilePicture: null,
  }

  const onSubmit = (
    values: ISignupFormValues,
    actions: FormikHelpers<ISignupFormValues>
  ) => {
    console.log(values)
    actions.setSubmitting(false)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={signupValidationSchema}
      onSubmit={onSubmit}
    >
      {({ setFieldValue }) => (
        <Form className='space-y-4'>
          <TextInput
            type='text'
            prefix={<FaUser />}
            name='fullName'
            placeholder='Full Name'
          />
          <TextInput
            type='text'
            prefix={<FaUser />}
            name='username'
            placeholder='Username'
          />
          <Field
            as='select'
            name='gender'
            className='select select-bordered w-full'
          >
            <option value={EGender.Male}>Male</option>
            <option value={EGender.Female}>Female</option>
          </Field>
          <TextInput
            prefix={<FaKey />}
            name='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            suffix={
              <PasswordAdornment show={showPassword} onClick={togglePassword} />
            }
          />
          <TextInput
            prefix={<FaKey />}
            name='confirmPassword'
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='Confirm Password'
            suffix={
              <PasswordAdornment
                show={showConfirmPassword}
                onClick={toggleConfirmPassword}
              />
            }
          />
          <label className='form-control w-full '>
            <div className='label'>
              <span className='label-text'>Profile picture</span>
            </div>
            <input
              type='file'
              name='profilePicture'
              className='file-input file-input-bordered w-full dark:bg-gray-900'
              accept='image/*'
              onChange={(e) =>
                setFieldValue(
                  'profilePicture',
                  e.currentTarget.files?.[0] || null
                )
              }
            />
          </label>
          <button type='submit' className='btn btn-accent w-full sm:text-lg'>
            Signup
          </button>
        </Form>
      )}
    </Formik>
  )
}

export default LoginForm
