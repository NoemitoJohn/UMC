import express from 'express'
import { authMiddleware, getLogin, getRegister, logOut, postLogin, postRegister } from '../controller/auth_controller';
import {body} from 'express-validator'

const authRouter = express.Router();

// middleware check if already had a valid token and redirect to index
// authRouter.use(authMiddleware)

authRouter.get('/login', authMiddleware, getLogin)
authRouter.post('/login', 
  [
    body('email').isEmail(),
    body('password').notEmpty()
  ],
  //handler
  authMiddleware,
  postLogin
)
authRouter.get('/register', authMiddleware, getRegister)

authRouter.post('/register',
  [
    // sanitizing inputs
    body('first_name').notEmpty().escape(),
    body('last_name').notEmpty().escape(),
    body('email').isEmail(),
    body('password').isLength({ min : 8}).escape().withMessage('password must be 8 characters'),
    body('confirm_password').custom((value, {req}) => {
      return value === req.body.password
    }).withMessage('password not match')
  ],
  
  authMiddleware,

  postRegister)

authRouter.post('/logout', logOut)


export {authRouter}