import express from 'express'
import { isAuthenticate } from '../../lib/middleware'


const adminUserRouter = express.Router()
adminUserRouter.use(isAuthenticate)

adminUserRouter.get('/', (req, res, next) => {
  // console.log(res.locals)
  const user = res.locals.token;
  res.render('pages/admin/users/index', {user : { type : user.type }})
})

adminUserRouter.get('/list',  async (req, res , next) => {
 
  

})

adminUserRouter.get('/create', (req, res, next) => {
  const user = res.locals.token;
  res.render('pages/admin/users/create-user', {user : {
    // has_info : null,
    type : user.type
  }})
})


export {
   adminUserRouter 
}