import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    readBy: [
      {
        reader: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        readAt: Date,
      },
    ],
  },
  { timestamps: true }
)
MessageSchema.index({ room: 1, 'readBy.reader': 1 })
const Message = mongoose.model('Message', MessageSchema)

export default Message
