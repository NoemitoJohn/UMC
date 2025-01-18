import express from 'express'
import { getUser } from '../controller/user_controller'
import { isAuthenticate } from '../lib/middleware'

const userRouter = express.Router()


userRouter.get('/info', isAuthenticate, getUser)


export {
  userRouter
}