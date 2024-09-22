import Room from '../models/room.model'

export const findOrCreateRoom = async (
  senderId: string,
  receiverId: string
) => {
  let room = await Room.findOne({
    participants: { $all: [senderId, receiverId] },
  })

  if (!room) {
    room = await Room.create({
      participants: [senderId, receiverId],
    })
  }

  room = await room.populate([
    { path: 'participants', select: '-password' },
    { path: 'lastMessage', populate: { path: 'sender', select: '-password' } },
  ])

  return room
}
