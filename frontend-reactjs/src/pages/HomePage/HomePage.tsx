import ChatBox from '../../components/Chat/ChatBox'
import MyRooms from '../../components/Chat/MyRooms'
import HomeNavbar from '../../components/navigation/HomeNavbar'
import ModalContextProvider from '../../context/ModalContext'
import useTotalUnreadMessagesListener from '../../hooks/listener/useTotalUnreadMessagesListener'
import useMessageListener from '../../hooks/listener/useMessageListener'
import ChatContextProvider from '../../context/ChatContext'
import { useAuthContext } from '../../hooks/context/useAuthContext'

const HomePage = () => {
  const { authUser } = useAuthContext()
  //messages listener
  useTotalUnreadMessagesListener()
  useMessageListener()

  return (
    <ChatContextProvider authUser={authUser}>
      <ModalContextProvider>
        <div className='w-full flex-1 flex flex-col'>
          <HomeNavbar />
          <main className='relative flex justify-between overflow-hidden p-4 w-full gap-3 h-[calc(100vh-4rem)]'>
            <MyRooms />
            <ChatBox />
          </main>
        </div>
      </ModalContextProvider>
    </ChatContextProvider>
  )
}

export default HomePage
