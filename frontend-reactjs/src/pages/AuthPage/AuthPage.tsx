import { useState } from 'react'
import './index.css'
import { MdOutlineConnectWithoutContact } from 'react-icons/md'

import LoginForm from '../../components/LoginForm'
import SignupForm from '../../components/SignupForm'
import AuthNavbar from '../../components/navigation/AuthNavbar'
import Tabs from '../../components/utils/Tabs'

// Main component with tab handling
const AuthPage = () => {
  const [selectedTab, setSelectedTab] = useState(0)

  return (
    <div className='flex-1 flex flex-col w-full'>
      <AuthNavbar />

      <main className='flex-1 flex justify-center items-center w-full p-4 overflow-y-auto mt-16'>
        <div className='container max-w-xl'>
          <div className='w-full p-6 bg-base-300 rounded-lg mt-10 mb-4'>
            <h1 className='flex justify-center items-center text-primary text-2xl sm:text-4xl font-semibold'>
              <MdOutlineConnectWithoutContact className='me-2' />
              Connectify
            </h1>
          </div>
          <div className='w-full p-6 bg-base-300 rounded-lg'>
            {/* TABS */}
            <Tabs
              tabs={['Login', 'Signup']}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
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
