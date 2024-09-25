import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { IRoom } from '../types/room.type'
import { getNotificationsQuery } from '../services/notification.service'
import { notifyReceiver } from '../services/socket.service'

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

io.on('connection', async (socket) => {
  console.log(
    `A user with Session ID: ${
      socket.id
    } is connected to Socket! ~ ${new Date().toLocaleDateString()}`
  )

  const userId = socket.handshake.query.userId as string
  if (userId) {
    userSocketMap.set(userId, socket.id)
  }

  // Online Users
  io.emit('getOnlineUsers', Array.from(userSocketMap.keys()))

  //join room
  socket.on('joinRoom', (roomId: string) => {
    socket.join(roomId)

    console.log(`User with Session ID: ${socket.id} joined Room ID: ${roomId}`)
    ;(socket as unknown as { roomId: string }).roomId = roomId
  })

  //update room
  socket.on('updateRoom', (room: IRoom) => {
    room.participants.forEach((participant) => {
      if (participant._id.toString() === userId) {
        return
      }

      notifyReceiver(participant._id.toString(), 'roomUpdated', room)
    })
  })

  //typing
  socket.on('typing', (room: IRoom) => {
    room.participants.forEach((participant) => {
      if (participant._id.toString() === userId) {
        return
      }

      notifyReceiver(participant._id.toString(), 'typingReceived', {
        roomId: room._id.toString(),
        userId,
      })
    })
  })

  socket.on('stopTyping', (room: IRoom) => {
    room.participants.forEach((participant) => {
      if (participant._id.toString() === userId) {
        return
      }

      notifyReceiver(participant._id.toString(), 'stopTypingReceived', {
        roomId: room._id.toString(),
        userId,
      })
    })
  })

  //notifications
  const notifications = await getNotificationsQuery(userId)
  io.to(socket.id).emit('getNotifications', notifications)

  socket.on('disconnect', () => {
    console.log(`User with Session ID: ${socket.id} disconnected!`)

    userSocketMap.delete(userId)
    io.emit('getOnlineUsers', Array.from(userSocketMap.keys()))
  })
})

export { app, io, server }
