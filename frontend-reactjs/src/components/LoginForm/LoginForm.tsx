import { Form, Formik, FormikHelpers } from 'formik'
import usePasswordVisibility from '../../hooks/usePasswordVisibility'
import * as Yup from 'yup'
import TextInput from '../inputs/TextInput'
import { FaKey, FaUser } from 'react-icons/fa'
import PasswordAdornment from '../utils/PasswordAdornment'
import { ILoginFormValues } from '../../types/login.type'
import useLogin from '../../hooks/requests/useLogin'

const loginValidationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
})

const LoginForm = () => {
  const { visible: showPassword, toggle: togglePassword } =
    usePasswordVisibility()
  const { loading, login } = useLogin()

  const initialValues: ILoginFormValues = {
    username: '',
    password: '',
  }

  const onSubmit = async (
    values: ILoginFormValues,
    actions: FormikHelpers<ILoginFormValues>
  ) => {
    await login(values)
    actions.setSubmitting(false)
    actions.resetForm()
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
          {loading ? (
            <span className='loading loading-spinner loading-md'></span>
          ) : (
            'Login'
          )}
        </button>
      </Form>
    </Formik>
  )
}

export default LoginForm
