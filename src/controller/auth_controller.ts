import {NextFunction, Request, Response} from 'express'
import { matchedData, validationResult } from 'express-validator'
import { formatValidationError, secret, signToken, verifyToken } from '../lib/lib'
import { db } from '../db/db'
import bcrypt from 'bcrypt'
import { LibsqlError } from '@libsql/client'


// redirect to index if already have a valid token
export const authMiddleware = (req : Request, res : Response, next : NextFunction) => {
  const token = req.cookies['token']
  if(token) {
    verifyToken(token)
    .then((jwt) => {
      res.redirect('/')
    }).catch(() => {
      next()
    })
    return
  }
  next()
}

export const getRegister = (req : Request, res : Response) => {
  res.render('pages/auth/sign-up')
}

export const postRegister = async (req : Request, res : Response) => {
  const validation = validationResult(req)
  
  if(!validation.isEmpty()){
    const errors = formatValidationError(validation.array())
    res.status(200).json({success : false,  errors : errors})
    return;
  }

  const data =  matchedData(req)
  
  try {
    
    const hash = await bcrypt.hash(data.password, 12);
    
    const transaction = await db.transaction('write')

    const getLatestUser = await transaction.execute('select ifnull(max(id), 0) as latest_id from users')
    
    const latestIdNumber = getLatestUser.rows[0].latest_id as number

    const formatId = `UMC-${new Date().getFullYear()}-${latestIdNumber + 1}`

    const insert = await transaction.execute({ 
      sql : `insert into users (first_name, last_name, password, email, umc_id) 
              values (?, ?, ? ,?, ?)`, 
      args : [data.first_name, data.last_name, hash, data.email , formatId]})
    
    await transaction.commit()
    
    const id = Number(insert.lastInsertRowid)
    
    const jwt = await signToken({email : data.email, id : id, type : 'user' });
    
    res.cookie('token', jwt, {
      httpOnly : true
    })
    
    res.location('/')
    res.status(200).json({success : true})

  } catch (error) {
    if(error instanceof LibsqlError) {
      if(error.code === 'SQLITE_CONSTRAINT_UNIQUE'){
        res.status(200).json({success : false,  errors : { email : { msg : 'Email already exist!'}}})
      }
    }

    console.log(error)
  }
  
}

export const getLogin = async (req : Request, res : Response) => {
  res.render('pages/auth/login')
}

export const postLogin =  async (req : Request, res : Response) => {
  const validation = validationResult(req)
  if(!validation.isEmpty()){
    const errors = formatValidationError(validation.array())
    res.status(200).json({success : false, code : 'VALIDATION',  errors : errors})
    return;
  }
  
  const data =  matchedData(req)

  const user =  await db.execute({sql : 'select * from users where email = ?', args : [data.email]})

  if(user.rows.length <= 0){
    res.status(200).json({success : false, code : 'CREDENTIAL', msg : 'Invalid Credentials' })
    return
  }
  
  const matchPassword = await bcrypt.compare(data.password, user.rows[0].password as string)
  
  if(!matchPassword){
    res.status(200).json({success : false, code : 'CREDENTIAL', msg : 'Invalid Credentials' })
    return  
  }

  const userData = user.rows[0]
  const token = await signToken({email : userData.email,  id : userData.id, type : userData.account_type})

  res.cookie('token', token, {
    httpOnly : true
  })
  res.location('/')
  res.status(200).json({success : true})

}

export const logOut = async (req : Request, res: Response) => {
  console.log('logout')
  res.clearCookie('token');
  res.location('/auth/login')
  res.status(200).json({success : true}); 
}