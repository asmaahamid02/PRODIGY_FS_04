import mongoose from 'mongoose'

const connectToDB = async () => {
  return await mongoose.connect(process.env.MONGO_URI as string)
}

export default connectToDB
