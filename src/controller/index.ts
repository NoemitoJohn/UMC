import { Response, Request } from "express"
import * as jose from 'jose'
import { verifyToken } from "../lib/lib"

export const getIndex = async (req : Request, res : Response ) => {
  try {
    const token = req.cookies['token']
    
    if(!token) { 
      res.redirect('/auth/login')
      return;
    }
    const { payload } = await verifyToken(token);
    // console.log(jwt)
    res.render('pages/index', { user : {type : payload.type}})

  } catch (error) {
    if(error instanceof jose.errors.JWSSignatureVerificationFailed){
      // redirect user to login page
      res.render('pages/auth/login')
    }
  }
  
}