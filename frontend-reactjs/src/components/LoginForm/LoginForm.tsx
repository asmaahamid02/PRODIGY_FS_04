import { Form, Formik, FormikHelpers } from 'formik'
import usePasswordVisibility from '../../hooks/usePasswordVisibility'
import * as Yup from 'yup'
import TextInput from '../inputs/TextInput'
import { FaKey, FaUser } from 'react-icons/fa'
import PasswordAdornment from '../utils/PasswordAdornment'
import { ILoginFormValues } from './types'

const loginValidationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
})

const LoginForm = () => {
  const { visible: showPassword, toggle: togglePassword } =
    usePasswordVisibility()

  const initialValues: ILoginFormValues = {
    username: '',
    password: '',
  }

  const onSubmit = (
    values: ILoginFormValues,
    actions: FormikHelpers<ILoginFormValues>
  ) => {
    console.log(values)
    actions.setSubmitting(false)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginValidationSchema}
      onSubmit={onSubmit}
    >
      <Form className='space-y-4'>
        <TextInput
          type='text'
          prefix={<FaUser />}
          name='username'
          placeholder='Username'
        />
        <TextInput
          prefix={<FaKey />}
          name='password'
          type={showPassword ? 'text' : 'password'}
          placeholder='Password'
          suffix={
            <PasswordAdornment show={showPassword} onClick={togglePassword} />
          }
        />
        <button type='submit' className='btn btn-accent w-full sm:text-lg'>
          Login
        </button>
      </Form>
    </Formik>
  )
}

export default LoginForm
