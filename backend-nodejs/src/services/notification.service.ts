import Message from '../models/message.model'
import { Types } from 'mongoose'
import { IRoom } from '../types/room.type'
import { IMessage } from '../types/message.type'
import { getUsersJoinedRoom, notifyReceiver } from './socket.service'

export const getNotificationsQuery = (userId: string) => {
  const userObjectId = new Types.ObjectId(userId)
  return Message.aggregate([
    //Match messages where the user is not in the readBy array
    {
      $match: {
        $and: [
          {
            sender: { $ne: userObjectId },
          },
          {
            readBy: { $exists: true },
          },
          {
            'readBy.reader': { $ne: userObjectId },
          },
          {
            'readBy.reader': { $ne: null },
          },
        ],
      },
    },
    //check if the user is a participant in the room
    {
      $lookup: {
        from: 'rooms',
        localField: 'room',
        foreignField: '_id',
        as: 'roomDetails',
      },
    },
    {
      $unwind: '$roomDetails',
    },
    {
      $match: {
        'roomDetails.participants': userObjectId,
      },
    },
    // Group by room, counting unread messages per room
    {
      $group: {
        _id: '$room', // Group by room
        unreadCount: { $sum: 1 }, // Count unread messages
        messages: { $push: '$$ROOT' }, // Push messages to the array
      },
    },
    // Join room details
    {
      $lookup: {
        from: 'rooms',
        localField: '_id',
        foreignField: '_id',
        as: 'room',
      },
    },
    {
      $unwind: '$room', // Flatten room details
    },
    //populate participants
    {
      $lookup: {
        from: 'users', // Assuming the collection name is `users`
        localField: 'room.participants',
        foreignField: '_id',
        as: 'participantsDetails', // Renaming the result
        pipeline: [{ $project: { password: 0 } }],
      },
    },
    //populate last message
    {
      $lookup: {
        from: 'messages',
        localField: 'room.lastMessage',
        foreignField: '_id',
        as: 'lastMessage',
      },
    },
    {
      $unwind: {
        path: '$lastMessage',
        preserveNullAndEmptyArrays: true,
      },
    },
    //populate last message sender
    {
      $lookup: {
        from: 'users',
        localField: 'lastMessage.sender',
        foreignField: '_id',
        as: 'lastMessage.sender',
        pipeline: [{ $project: { password: 0 } }],
      },
    },
    {
      $unwind: {
        path: '$sender',
        preserveNullAndEmptyArrays: true,
      },
    },
    //populate group admin
    {
      $lookup: {
        from: 'users',
        localField: 'room.groupAdmin',
        foreignField: '_id',
        as: 'room.groupAdmin',
        pipeline: [{ $project: { password: 0 } }],
      },
    },
    {
      $unwind: {
        path: '$room.groupAdmin',
        preserveNullAndEmptyArrays: true,
      },
    },
    // Select fields to return
    {
      $project: {
        isGroup: '$room.isGroup',
        groupAdmin: '$room.groupAdmin',
        groupName: '$room.groupName',
        createdAt: '$room.createdAt',
        participants: '$participantsDetails',
        unreadCount: 1,
        lastMessage: 1,
      },
    },
  ])
}

export const notifyRoomParticipants = async (
  room: IRoom,
  senderId: string,
  message: IMessage
) => {
  room.participants.forEach((participant) => {
    if (participant._id.toString() === senderId.toString()) return
    notifyReceiver(participant._id.toString(), 'messageReceived', message)
  })
}

export const notifyUsersOutsideRoom = async (room: IRoom) => {
  const usersInRoom = getUsersJoinedRoom(room._id.toString())
  const usersOutsideRoom = room.participants.filter(
    (participant) => !usersInRoom.includes(participant._id.toString())
  )

  if (usersOutsideRoom.length > 0) {
    const notificationPromises = usersOutsideRoom.map(async (participant) =>
      getNotificationsQuery(participant._id.toString())
    )
    const results = await Promise.all(notificationPromises)

    usersOutsideRoom.forEach((participant, index) => {
      notifyReceiver(
        participant._id.toString(),
        'newNotifications',
        results[index]
      )
    })
  }
}
