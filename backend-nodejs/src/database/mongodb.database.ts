import mongoose from 'mongoose'
import { getErrorMessage } from '../utils/error.util'

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string)
    console.log('Connected to MongoDB successfully!')
  } catch (error: unknown) {
    console.log(getErrorMessage(error, 'Failed to connect to MongoDB!'))
  }
}

export default connectToMongoDB
