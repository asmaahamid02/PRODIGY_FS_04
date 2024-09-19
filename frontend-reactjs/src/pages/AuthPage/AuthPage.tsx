import { useState } from 'react'
import './index.css'
import { MdOutlineConnectWithoutContact } from 'react-icons/md'

import LoginForm from '../../components/LoginForm'
import SignupForm from '../../components/SignupForm'
import AuthNavbar from '../../components/navigation/AuthNavbar'

// Main component with tab handling
const AuthPage = () => {
  const [selectedTab, setSelectedTab] = useState(0)

  return (
    <div className='w-full min-h-screen'>
      <AuthNavbar />

      <main className='flex justify-center items-center w-full p-4 h-[calc(100vh-5rem)]'>
        <div className='container max-w-xl'>
          <div className='w-full p-6 bg-gray-200 dark:bg-gray-800 rounded-lg mt-10 mb-4'>
            <h1 className='flex justify-center items-center text-primary text-2xl sm:text-4xl font-semibold'>
              <MdOutlineConnectWithoutContact className='me-2' />
              Connectify
            </h1>
          </div>
          <div className='w-full p-6 bg-gray-200 dark:bg-gray-800 rounded-lg'>
            <div role='tablist' className='tabs tabs-boxed w-full bg-inherit'>
              <button
                className={`tab font-medium text-lg py-3 h-auto ${
                  selectedTab === 0 ? 'tab-active' : ''
                }`}
                onClick={() => setSelectedTab(0)}
              >
                Login
              </button>
              <button
                className={`tab font-medium text-lg py-3 h-auto ${
                  selectedTab === 1 ? 'tab-active' : ''
                }`}
                onClick={() => setSelectedTab(1)}
              >
                Signup
              </button>
            </div>
            <div className='mt-4' role='tabpanel'>
              {selectedTab === 0 ? <LoginForm /> : <SignupForm />}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AuthPage
