import express, { Router } from 'express'
import {
  getRooms,
  getRoomMessages,
  getRoom,
} from '../controllers/room.controller'
import protectRoute from '../middlewares/protectRoute.middleware'

const router: Router = express.Router()

router.get('/', protectRoute, getRooms)
router.get('/:id/messages', protectRoute, getRoomMessages)
router.get('/:receiverId', protectRoute, getRoom)

export default router
