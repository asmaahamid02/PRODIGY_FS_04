import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.tsx'
import SocketContextProvider from './context/SocketContext.tsx'
import { ThemeContextProvider } from './context/ThemeContext.tsx'
import ChatContextProvider from './context/ChatContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeContextProvider>
        <AuthContextProvider>
          <SocketContextProvider>
            <ChatContextProvider>
              <App />
            </ChatContextProvider>
          </SocketContextProvider>
        </AuthContextProvider>
      </ThemeContextProvider>
    </BrowserRouter>
  </StrictMode>
)
