import ChatBox from '../../components/Chat/ChatBox'
import MyRooms from '../../components/Chat/MyRooms'
import HomeNavbar from '../../components/navigation/HomeNavbar'
import ModalContextProvider from '../../context/ModalContext'

const HomePage = () => {
  return (
    <ModalContextProvider>
      <div className='w-full flex-1 flex flex-col'>
        <HomeNavbar />
        <main className='flex-1 flex justify-between p-4 w-full gap-3'>
          <MyRooms />
          <ChatBox />
        </main>
      </div>
    </ModalContextProvider>
  )
}

export default HomePage
