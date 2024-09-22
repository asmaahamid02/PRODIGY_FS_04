import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { IRoom } from '../types/room.type'

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
  pingTimeout: 60000,
})

const userSocketMap = new Map<string, string>()

export const getReceiverSocketId = (receiverId: string) =>
  userSocketMap.get(receiverId)

io.on('connection', (socket) => {
  console.log(
    `A user with Session ID: ${
      socket.id
    } is connected to Socket! ~ ${new Date().toLocaleDateString()}`
  )

  const userId = socket.handshake.query.userId as string
  if (userId) {
    userSocketMap.set(userId, socket.id)
  }

  //TODO get online users that have a chat with the current user
  // Online Users
  io.emit('getOnlineUsers', Array.from(userSocketMap.keys()))

  //typing
  socket.on('typing', (room: IRoom) => {
    room.participants.forEach((participant) => {
      if (participant._id.toString() === userId) {
        return
      }

      const receiverSocketId = getReceiverSocketId(
        participant._id.toString()
      ) as string
      socket
        .in(receiverSocketId)
        .emit('typingReceived', { roomId: room._id.toString(), userId })
    })
  })

  socket.on('stopTyping', (room: IRoom) => {
    room.participants.forEach((participant) => {
      if (participant._id.toString() === userId) {
        return
      }

      const receiverSocketId = getReceiverSocketId(
        participant._id.toString()
      ) as string
      socket
        .in(receiverSocketId)
        .emit('stopTypingReceived', { roomId: room._id.toString(), userId })
    })
  })

  socket.on('disconnect', () => {
    console.log(`User with Session ID: ${socket.id} disconnected!`)

    userSocketMap.delete(userId)
    io.emit('getOnlineUsers', Array.from(userSocketMap.keys()))
  })
})

export { app, io, server }
