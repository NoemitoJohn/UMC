import {NextFunction, Request, Response} from 'express'
import { matchedData, validationResult } from 'express-validator'
import { formatValidationError, secret, signToken, verifyToken } from '../lib/lib'
import {  db } from '../db/db'
import bcrypt from 'bcrypt'
import { LibsqlError } from '@libsql/client'
//TODO: Change auth to express session

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

export const postRegister = async (req : Request, res : Response, next : NextFunction) => {
  const validation = validationResult(req)
  
  if(!validation.isEmpty()){
    const errors = formatValidationError(validation.array())
    res.status(200).json({success : false,  errors : errors})
    return;
  }

  const data =  matchedData(req)
  
  const transaction = await db.transaction('write')
  
  try {
    const lastest_id = await transaction.execute('SELECT IFNULL(MAX(id), 0) as latest_id from users')

    const latestIdNumber = lastest_id.rows[0].latest_id as number

    const formatId = `UMC-${new Date().getFullYear()}-${latestIdNumber + 1}`

    const hash = await bcrypt.hash(data.password, 12)

    const insertUser = await transaction.execute({
      sql : `INSERT INTO users (first_name, last_name, password, email, umc_id) VALUES (?, ?, ? ,?, ?)`, 
      args : [data.first_name, data.last_name, hash, data.email , formatId]
    })

    await transaction.commit()

    const id = Number(insertUser.lastInsertRowid)
    signToken({email : data.email, id : id, type : 'user' }).then(jwt => { // get jwt token
      res.cookie('token', jwt, {
        httpOnly : true
      })

      res.location('/')
      res.status(200).json({success : true})
    })
    .catch(err => next(err))

  } catch (error) {
    
    await transaction.rollback()
    
    if(error instanceof LibsqlError) {
      if(error.code === 'SQLITE_CONSTRAINT_UNIQUE'){
        res.status(200).json({success : false,  errors : { email : { msg : 'Email already exist!'}}})
      }
    }
    next(error)
    console.log(error)
  }finally{
    // transaction.close()
  }
  
}

export const getLogin = async (req : Request, res : Response) => {
  res.render('pages/auth/login')
}

export const postLogin =  async (req : Request, res : Response, next : NextFunction) => {
  const validation = validationResult(req)
  if(!validation.isEmpty()){
    const errors = formatValidationError(validation.array())
    res.status(200).json({success : false, code : 'VALIDATION',  errors : errors})
    return;
  }
  
  const data = matchedData(req)
  const getUserEmail = await db.execute({sql : 'select * from users where email = ?', args : [data.email]})
  
  if(getUserEmail.rows.length <= 0) {
    res.status(200).json({success : false, code : 'CREDENTIAL', msg : 'Invalid Credentials' })
    return
  }

  const user = getUserEmail.rows[0]

  const match = await bcrypt.compare(data.password, user.password as string)


  if(!match) {
    res.status(200).json({success : false, code : 'CREDENTIAL', msg : 'Invalid Credentials' })
    return 
  }


  signToken({email : user.email,  id : user.id, type : user.account_type })
  .then(jwt => {
    
    res.cookie('token', jwt, {
      httpOnly : true
    })

    res.location('/')
    res.status(200).json({success : true})
  })

  // get user by email
  // connection.query('select * from users where email = ?', [data.email], (err, rows) => {
  //   if(err) { next(err) }
  //   // return fail if no email match
  //   if(rows.length <= 0) {
  //     res.status(200).json({success : false, code : 'CREDENTIAL', msg : 'Invalid Credentials' })
  //     return
  //   }

  //   const user = rows[0]
  //   // compare password
  //   bcrypt.compare(data.password, user.password, (err, match) => {
  //     if(err) { next(err) }
      
  //     if(!match) {
  //       res.status(200).json({success : false, code : 'CREDENTIAL', msg : 'Invalid Credentials' })
  //       return  
  //     }
  //     // sign token
  //     signToken({email : user.email,  id : user.id, type : user.account_type })
  //       .then(jwt => {
          
  //         res.cookie('token', jwt, {
  //           httpOnly : true
  //         })

  //         res.location('/')
  //         res.status(200).json({success : true})
  //       })
  //   })
  // })
}

export const logOut = async (req : Request, res: Response) => {
  console.log('logout')
  res.clearCookie('token');
  res.location('/auth/login')
  res.status(200).json({success : true}); 
}