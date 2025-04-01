import express from 'express'
import { isAuthenticate } from '../../lib/middleware'
import { db } from '../../db/db'
import * as fs from 'fs'
import sharp from 'sharp'

const adminUserRouter = express.Router()
adminUserRouter.use(isAuthenticate)

adminUserRouter.get('/', async (req, res, next) => {
  // console.log(res.locals)
  const user = res.locals.token;
  const getUsers = await db.execute(`
    SELECT u.id, u.umc_id, last_name, first_name, l_c.name as local_church, church_position FROM users_info u_i 
    INNER JOIN users u on u.id = u_i.user_id
    INNER JOIN local_church l_c on l_c.id = u_i.local_church
    WHERE u.has_info = 1
    `)
  
  res.render('pages/admin/users/index', {user : { type : user.type }, users : getUsers.rows})
})

adminUserRouter.get('/list',  async (req, res , next) => {
  try {
    const getUsers = await db.execute('SELECT * FROM users_info')

  } catch (error) {
    next(error)
  }
})

adminUserRouter.get('/print/:id', async (req, res, next) => {
  
  const {id} = req.params;
  
  try {
    const getUser = await db.execute(`
      SELECT id_picture_blob as img, 
        u_i.church_position as position,
        u_i.contact_number,
        u.email,
        u_i.emergency_contact_number as e_number,
        u_i.emergency_contact_name as e_name,
        concat_ws(', ', address, barangay, city, province) as address,
        concat_ws(' ', u.last_name, u.first_name) as name
      FROM users_info u_i 
      INNER JOIN users u ON u.id = u_i.user_id WHERE user_id = ${id} `)
    
    const user = getUser.rows[0] 
    
    const bufferImg = Buffer.from(user.img as ArrayBuffer)
    const img =  await sharp(bufferImg).resize({width : 295, height : 303}).toBuffer()

    const data = {...user, img : img.toString('base64')}
    res.render('pages/admin/users/print-id', data)
    
    } catch (error) {
        console.log(error)
  }
})


adminUserRouter.get('/create', (req, res, next) => {
  const user = res.locals.token;
  res.render('pages/admin/users/create-user', {user : {
    type : user.type
  }})
})


export {
   adminUserRouter 
}