import express, { Router } from 'express'
import { sendMessage, getMessages } from '../controllers/message.controller'
import protectRoute from '../middlewares/protectRoute.middleware'

const router: Router = express.Router()

router.post('/send', protectRoute, sendMessage)
router.get('/rooms/:roomId', protectRoute, getMessages)
export default router
