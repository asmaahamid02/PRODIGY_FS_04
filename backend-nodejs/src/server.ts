import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route'
import connectToMongoDB from './database/mongodb.database'

const app: Express = express()
const port = process.env.PORT || 8000

dotenv.config()

app.use(express.json()) //To parse incoming requests with Json payload

app.use('/api/auth', authRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Connectify NodeJs App')
})

app.listen(port, () => {
  connectToMongoDB()
  console.log(`Server is running at port ${port}`)
})
