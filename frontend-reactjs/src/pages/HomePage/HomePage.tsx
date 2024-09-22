import ChatBox from '../../components/Chat/ChatBox'
import MyRooms from '../../components/Chat/MyRooms'
import HomeNavbar from '../../components/navigation/HomeNavbar'
import ModalContextProvider from '../../context/ModalContext'
import useTotalUnreadMessagesListener from '../../hooks/useTotalUnreadMessagesListener'
import useMessageListener from '../../hooks/useMessageListener'

const HomePage = () => {
  //messages listener
  useTotalUnreadMessagesListener()
  useMessageListener()

  return (
    <ModalContextProvider>
      <div className='w-full flex-1 flex flex-col'>
        <HomeNavbar />
        <main className='relative flex justify-between overflow-hidden p-4 w-full gap-3 h-[calc(100vh-4rem)]'>
          <MyRooms />
          <ChatBox />
        </main>
      </div>
    </ModalContextProvider>
  )
}

export default HomePage
