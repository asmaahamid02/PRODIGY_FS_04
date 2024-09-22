import { Field, Form, Formik, FormikHelpers } from 'formik'
import usePasswordVisibility from '../../hooks/usePasswordVisibility'
import * as Yup from 'yup'
import TextInput from '../inputs/TextInput'
import { FaKey, FaUser } from 'react-icons/fa'
import PasswordAdornment from '../utils/PasswordAdornment'
import { ISignupFormValues } from '../../types/signup.type'
import useSignup from '../../hooks/useSignup'
import { EGender } from '../../types/user.type'
// import FileInput from '../inputs/FileInput'

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

const SignupForm = () => {
  const { visible: showPassword, toggle: togglePassword } =
    usePasswordVisibility()
  const { visible: showConfirmPassword, toggle: toggleConfirmPassword } =
    usePasswordVisibility()
  const { loading, signup } = useSignup()

  const initialValues: ISignupFormValues = {
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: EGender.Male,
    profilePicture: null,
  }

  const onSubmit = async (
    values: ISignupFormValues,
    actions: FormikHelpers<ISignupFormValues>
  ) => {
    await signup(values)
    actions.setSubmitting(false)
    actions.resetForm()
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={signupValidationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
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

          {/* <FileInput
            name='profilePicture'
            accept='image/*'
            label='Profile picture'
            onChange={(e) =>
              setFieldValue(
                'profilePicture',
                e.currentTarget.files?.[0] || null
              )
            }
          /> */}

          <button
            type='submit'
            className='btn btn-accent w-full sm:text-lg'
            disabled={loading || isSubmitting}
          >
            {loading ? (
              <span className='loading loading-spinner loading-md'></span>
            ) : (
              'Signup'
            )}
          </button>
        </Form>
      )}
    </Formik>
  )
}

export default SignupForm
