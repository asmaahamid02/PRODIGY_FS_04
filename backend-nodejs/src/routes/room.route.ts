import express, { Router } from 'express'
import {
  getRooms,
  getRoomMessages,
  getRoom,
  createGroup,
  updateGroup,
  leaveGroup,
} from '../controllers/room.controller'
import protectRoute from '../middlewares/protectRoute.middleware'

const router: Router = express.Router()

router.get('/', protectRoute, getRooms)
router.get('/:id/messages', protectRoute, getRoomMessages)
router.get('/:receiverId', protectRoute, getRoom)
router.post('/group', protectRoute, createGroup)
router.post('/group/:roomId', protectRoute, updateGroup)
router.post('/group/:roomId/leave', protectRoute, leaveGroup)

export default router
