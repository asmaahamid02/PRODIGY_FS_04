import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 50,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 5,
      maxLength: 20,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female'],
    },
    profilePicture: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)

export default User
