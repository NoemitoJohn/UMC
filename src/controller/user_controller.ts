import {Response, Request, NextFunction} from 'express'
import { db } from '../db/db'

export const getUser = async (req : Request, res : Response, next : NextFunction) => {
  const token = res.locals.token
  try {
    const query = 'SELECT users.first_name, users.last_name, users.email, users.has_info, users.umc_id, users_info.* FROM users LEFT JOIN users_info ON users.id = users_info.user_id WHERE users.id = ?'
    const getUser =  await db.execute({sql : query, args : [ token['id'] ] })
    const [user] = getUser.rows
    console.log(user)
  
    res.render('pages/user/index', { user : user})

  } catch (error) {
      next(error)
  }
}
