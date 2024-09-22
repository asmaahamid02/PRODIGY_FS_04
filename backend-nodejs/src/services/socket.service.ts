import { getReceiverSocketId, io } from '../socket'
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
