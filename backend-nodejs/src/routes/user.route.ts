import express, { Router } from 'express'
import { searchUsers } from '../controllers/user.controller'
import protectRoute from '../middlewares/protectRoute.middleware'

const router: Router = express.Router()

//get messaged users
router.get('/', protectRoute, searchUsers)

export default router
