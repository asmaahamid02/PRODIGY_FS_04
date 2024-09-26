import { getReceiverSocketId, io } from '../config/socket.config'
export const notifyReceiver = (
  receiverId: string,
  event: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
) => {
  const receiverSocketId = getReceiverSocketId(receiverId)

  if (receiverSocketId && io.sockets.sockets.has(receiverSocketId)) {
    io.to(receiverSocketId).emit(event, data)

    console.log(
      `Event: ${event} emitted to User ID: ${receiverId} with Socket ID: ${receiverSocketId}`
    )
  }
}

export const getUsersJoinedRoom = (roomId: string): string[] => {
  const users: string[] = []
  const socketIdsJoinedRoom = io.sockets.adapter.rooms.get(roomId)

  if (socketIdsJoinedRoom) {
    socketIdsJoinedRoom.forEach((socketId) => {
      const userId = io.sockets.sockets.get(socketId)?.handshake.query
        .userId as string
      users.push(userId)
    })
  }

  return users
}
