import express, { Router } from 'express'
import { sendMessage } from '../controllers/message.controller'
import protectRoute from '../middlewares/protectRoute.middleware'

const router: Router = express.Router()

router.post('/send/:roomId', protectRoute, sendMessage)
export default router
