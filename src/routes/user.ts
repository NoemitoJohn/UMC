import express from 'express'
import { getUser, postUser } from '../controller/user_controller'
import { isAuthenticate } from '../lib/middleware'
import { upload } from '../lib/lib'

const userRouter = express.Router()

userRouter.use(isAuthenticate)


// userRouter.use('/')

userRouter.get('/info', getUser)
userRouter.post('/info', upload.single('id_img_1x1') , postUser)

export {
  userRouter
}