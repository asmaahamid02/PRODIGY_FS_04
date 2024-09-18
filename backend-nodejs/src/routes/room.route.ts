import express, { Router } from 'express'
import { getRooms, getRoomMessages } from '../controllers/room.controller'
import protectRoute from '../middlewares/protectRoute.middleware'

const router: Router = express.Router()

router.get('/', protectRoute, getRooms)
router.get('/:id', protectRoute, getRoomMessages)

export default router
