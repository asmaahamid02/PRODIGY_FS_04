import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      default: null,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const Message = mongoose.model('Message', MessageSchema)

export default Message
