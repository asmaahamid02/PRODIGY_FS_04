import ChatBox from '../../components/Chat/ChatBox'
import MyRooms from '../../components/Chat/MyRooms'
import HomeNavbar from '../../components/navigation/HomeNavbar'
import ModalContextProvider from '../../context/ModalContext'
import useMessageListener from '../../hooks/listener/useMessageListener'
import useNotificationListener from '../../hooks/listener/useNotificationListener'
import useRoomListener from '../../hooks/listener/useRoomListener'
import useLogout from '../../hooks/requests/useLogout'
import axiosInterceptor from '../../services/api.service'

const HomePage = () => {
  const { logout } = useLogout()
  axiosInterceptor(logout)
  //messages listener
  useNotificationListener()
  useMessageListener()
  useRoomListener()

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
