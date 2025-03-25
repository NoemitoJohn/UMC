import {Request, Response, NextFunction} from 'express'
import { verifyToken } from './lib';

export const accessOnly = (type : string) => {
  return function(req : Request, res : Response, next : NextFunction) {
    const token = req.cookies['token'];
    
    if(!token) {
      if(req.xhr) {  
        res.status(401).json({msg : 'Unauthorized'}); 
        return; 
      }
      res.send('Unauthorized!')
    }
    
    verifyToken(token)
    .then((jwt) => {
      if(jwt.payload.type == type){
        next()
        return;
      }
      
      if(req.xhr) {
        res.status(401).json({msg : 'Unauthorized'})
        return;
      }
      
      res.send('Unauthorized');
      
    }).catch(() => {
      
      if(req.xhr) {
        res.status(401).json({msg : 'Unauthorized'})
        return;
      }
      res.send('Unauthorized');
      // res.status(401).json({msg : 'Unauthorized'})
    })
    
  }
} 

export const isAuthenticate = async (req : Request, res : Response, next : NextFunction) => {
  const token = req.cookies['token'];
  
  if(!token) {
    
    if(req.xhr) {
      res.status(401).json({msg : 'Unauthorized!'})
      return;
    }
    
    res.redirect('/auth/login')
    return;
  }

  try {
    
    const {payload} = await verifyToken(token)
    res.locals.token = payload; 
    res.locals.user_type = payload['type']
    next()

  } catch (error) {
    next(error)
  }

}