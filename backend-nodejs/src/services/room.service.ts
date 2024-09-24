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
    { path: 'groupAdmin', select: '-password' },
    { path: 'lastMessage', populate: { path: 'sender', select: '-password' } },
  ])

  return room
}

export const findRoomById = async (roomId: string) => {
  return await Room.findById(roomId).populate([
    { path: 'participants', select: '-password' },
    { path: 'groupAdmin', select: '-password' },
    { path: 'lastMessage', populate: { path: 'sender', select: '-password' } },
  ])
}

export const findOrCreateRoomByParticipants = async (
  participants: string[]
) => {
  let isNew = false
  let room = await Room.findOne({
    participants: { $all: participants },
  })

  if (!room) {
    room = await Room.create({
      participants,
    })

    isNew = true
  }

  room = await room.populate([
    { path: 'participants', select: '-password' },
    { path: 'groupAdmin', select: '-password' },
    { path: 'lastMessage', populate: { path: 'sender', select: '-password' } },
  ])

  return { room, isNew }
}

export const findRoomByParticipants = async (participants: string[]) => {
  return await Room.findOne({
    participants: { $all: participants },
  }).populate([
    { path: 'participants', select: '-password' },
    { path: 'groupAdmin', select: '-password' },
    { path: 'lastMessage', populate: { path: 'sender', select: '-password' } },
  ])
}

export const findParticipantRooms = async (userId: string) => {
  return await Room.find({
    participants: userId,
  })
    .populate([
      { path: 'participants', select: '-password' },
      { path: 'groupAdmin', select: '-password' },
      {
        path: 'lastMessage',
        populate: { path: 'sender', select: '-password' },
      },
    ])
    .sort({ updatedAt: -1 })
}

// const rooms = await Room.aggregate([
//   {
//     $match: {
//       participants: userId, // Match rooms where the user is a participant
//     },
//   },
//   {
//     $lookup: {
//       from: 'messages',
//       localField: 'lastMessage',
//       foreignField: '_id',
//       as: 'lastMessage',
//     },
//   },
//   {
//     $unwind: {
//       path: '$lastMessage',
//       preserveNullAndEmptyArrays: true, // To keep rooms with no messages
//     },
//   },
//   {
//     $lookup: {
//       from: 'messages',
//       localField: '_id',
//       foreignField: 'room',
//       let: { roomId: '$_id' },
//       pipeline: [
//         {
//           $match: {
//             $expr: {
//               $and: [
//                 { $eq: ['$room', '$$roomId'] },
//                 { $ne: ['$sender', userId] }, // Filter messages sent by the user
//                 //filter messages that are not read by the user
//                 {
//                   $not: {
//                     $filter: {
//                       input: '$readBy',
//                       as: 'read',
//                       cond: {
//                         $eq: ['$$read.reader', userId],
//                       },
//                     },
//                   },
//                 },
//               ],
//             },
//           },
//         },
//         {
//           $count: 'unreadCount', // Count unread messages
//         },
//       ],
//       as: 'unreadMessages',
//     },
//   },
//   {
//     $unwind: {
//       path: '$unreadMessages',
//       preserveNullAndEmptyArrays: true, // To keep rooms with zero unread messages
//     },
//   },
//   {
//     $addFields: {
//       unreadCount: { $ifNull: ['$unreadMessages.unreadCount', 0] }, // Default to 0 if no unread messages
//     },
//   },
//   // {
//   //   $project: {
//   //     unreadMessages: 0,
//   //   },
//   // },
//   {
//     $lookup: {
//       from: 'users',
//       localField: 'participants',
//       foreignField: '_id',
//       as: 'participants',
//       pipeline: [{ $project: { password: 0 } }],
//     },
//   },
//   {
//     $lookup: {
//       from: 'users',
//       localField: 'groupAdmin',
//       foreignField: '_id',
//       as: 'groupAdmin',
//       pipeline: [{ $project: { password: 0 } }],
//     },
//   },
//   {
//     $lookup: {
//       from: 'users',
//       localField: 'lastMessage.sender',
//       foreignField: '_id',
//       as: 'lastMessage.sender',
//       pipeline: [{ $project: { password: 0 } }],
//     },
//   },
//   {
//     $sort: { updatedAt: -1 },
//   },
// ])

// const rooms = await Room.aggregate([
//   {
//     // Match rooms where the user is a participant
//     $match: { participants: userId },
//   },
//   {
//     // Join the `Message` collection
//     $lookup: {
//       from: 'messages', // Collection name in MongoDB (plural of Message model)
//       localField: '_id', // Room ID
//       foreignField: 'room', // The room field in Message schema
//       as: 'messages', // Alias for the joined messages
//     },
//   },
//   {
//     // Filter messages where the current user has not read the message
//     $addFields: {
//       unreadMessages: {
//         $filter: {
//           input: '$messages',
//           as: 'message',
//           cond: {
//             $not: {
//               $in: [userId, '$$message.readBy.reader'], // Check if userId is NOT in the readBy array
//             },
//           },
//         },
//       },
//     },
//   },
//   {
//     // Count the unread messages
//     $addFields: {
//       unreadCount: { $size: '$unreadMessages' },
//     },
//   },
//   {
//     // Optionally, if you need to populate additional fields like participants and groupAdmin
//     $lookup: {
//       from: 'users', // Collection name for User
//       localField: 'participants',
//       foreignField: '_id',
//       as: 'participants',
//       pipeline: [{ $project: { password: 0 } }],
//     },
//   },
//   {
//     // Populate groupAdmin as well
//     $lookup: {
//       from: 'users',
//       localField: 'groupAdmin',
//       foreignField: '_id',
//       as: 'groupAdmin',
//       pipeline: [{ $project: { password: 0 } }],
//     },
//   },
//   {
//     // Flatten the nested arrays for `groupAdmin` and `lastMessage`
//     $unwind: { path: '$groupAdmin', preserveNullAndEmptyArrays: true },
//   },
//   {
//     // Populate lastMessage with sender data
//     $lookup: {
//       from: 'messages',
//       localField: 'lastMessage',
//       foreignField: '_id',
//       as: 'lastMessage',
//     },
//   },
//   {
//     $unwind: { path: '$lastMessage', preserveNullAndEmptyArrays: true },
//   },
//   {
//     // Populate the sender of the lastMessage
//     $lookup: {
//       from: 'users',
//       localField: 'lastMessage.sender',
//       foreignField: '_id',
//       as: 'lastMessage.sender',
//       pipeline: [{ $project: { password: 0 } }],
//     },
//   },
//   {
//     // Flatten the sender for the lastMessage
//     $unwind: {
//       path: '$lastMessage.sender',
//       preserveNullAndEmptyArrays: true,
//     },
//   },
//   {
//     // Sort by the most recently updated rooms
//     $sort: { updatedAt: -1 },
//   },
//   {
//     // Select the fields you need in the output
//     $project: {
//       messages: 0,
//       unreadMessages: 0,
//     },
//   },
// ])
