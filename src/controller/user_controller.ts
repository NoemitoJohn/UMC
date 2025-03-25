import {Response, Request, NextFunction} from 'express'
import bcrypt from 'bcrypt'
import { db } from '../db/db'
import sharp from 'sharp'

export const getUser = async (req : Request, res : Response, next : NextFunction) => {
  const token = res.locals.token
  
  try {
    const getUserById = await db.execute({
      sql : 'SELECT users.first_name, users.last_name, users.email, users.has_info, users.umc_id, users_info.*, DATE(users_info.birthday) as atay FROM users LEFT JOIN users_info ON users.id = users_info.user_id WHERE users.id = ?',
      args : [token['id']]
    })
    const user = getUserById.rows[0]
    console.log(user)
    res.render('pages/user/index', { 
      user : user, 
      region : user['region_code'],
      provinces : user['province_code'],
      cities : user['city_code'],
      barangay : user['barangay_code'],
      local_church : user['local_church'],
      episcopal_area: user['episcopal_area']
    })


  } catch (error) {
    next(error)
  }
}

export const postUser = async (req : Request, res : Response, next : NextFunction) => {
  const userData = req.body
  
  const tx = await db.transaction('write')

  if(!tx) return next(new Error('Something went wrong'))

  try {
    
    const fileBuffer = await sharp(req.file?.buffer).toBuffer()
    const getLatestId = await tx.execute('SELECT IFNULL(MAX(id), 0) as latest_id from users_info')
    
    const latestIdNumber = getLatestId.rows[0].latest_id as number
    
    const UMCId = `UMC-${new Date().getFullYear()}-${latestIdNumber + 1}`

    const hash = await bcrypt.hash('12345@!', 12)

    const addUser = await tx.execute({
      sql : 'INSERT INTO users (first_name, last_name, email, password, umc_id, has_info, middle_name ) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      args : [
        userData['first_name'],
        userData['last_name'],
        userData['email'],
        hash,
        UMCId,
        1,
        userData['middle_name']
    ]})
    const userId = Number(addUser.lastInsertRowid)

    const sql = `INSERT INTO users_info (
      user_id,
      birthday,
      region_code,
      province_code,
      city_code,
      barangay_code,
      address,
      zipcode,
      local_church, 
      local_church_address,
      episcopal_area,
      annual_conference,
      district_conference,
      contact_number,
      emergency_contact_number,
      emergency_contact_name,
      id_picture_blob,
      gender,
      church_position,
      region,
      province,
      city,
      barangay
      )
    VALUES (? , DATE(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    const addUserInfo  = await tx.execute({sql : sql, args : 
      [
        userId,
        userData['birthday'],
        userData['region_code'],
        userData['province_code'],
        userData['city_code'],
        userData['barangay_code'],
        userData['address'],
        userData['zipcode'],
        userData['local_church'],
        userData['local_church_address'],
        userData['episcopal_area'],
        userData['annual_conference'],
        userData['district_conference'],
        userData['contact_number'],
        userData['emergency_contact_number'],
        userData['emergency_contact_name'],
        fileBuffer,
        userData['gender'],
        userData['church_position'],
        userData['region_name'],
        userData['province_name'],
        userData['city_name'],
        userData['barangay_name'],
      ]
    })

    await tx.commit()
  } catch (error) {
    await tx.rollback()
    next(error)
  }

}