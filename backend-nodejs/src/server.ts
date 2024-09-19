import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route'
import roomRoutes from './routes/room.route'
import messageRoutes from './routes/message.route'
import userRoutes from './routes/user.route'
import connectToMongoDB from './database/mongodb.database'
import cookieParser from 'cookie-parser'
import { IUserBasicInfo } from './types/user.type'
import cors from 'cors'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8000

//add user property to Request interface
declare module 'express-serve-static-core' {
  interface Request {
    user?: IUserBasicInfo | null
  }
}

app.use(express.json()) //To parse incoming requests with Json payload
app.use(cookieParser()) //To access the cookies in the request
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
) // Allow cross-origin requests

app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/users', userRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Connectify NodeJs App')
})

app.listen(port, () => {
  connectToMongoDB()
  console.log(`Server is running at port ${port}`)
})
