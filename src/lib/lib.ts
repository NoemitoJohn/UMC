import { ValidationError } from "express-validator";
import * as jose from 'jose'


export const formatValidationError = (errors : ValidationError[]) => {
  const err : Record<string, Record<string, string>> = {}
  for (const error of errors) {
    if(error.type === 'field') {
        err[error.path] = { value : error.value, msg : error.msg}
    }
  }
  return err
}
export const secret = new TextEncoder().encode('cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2')

export const signToken = async (payload : jose.JWTPayload ) => {
  const jwt = await new jose.SignJWT(payload)
          .setProtectedHeader({alg : 'HS256'})
          .setIssuedAt()
          .sign(secret)
  return jwt
}

export const verifyToken = async (token: string | Uint8Array) => {
  const jwt = await jose.jwtVerify(token, secret)
  return jwt
  // token, secret
}
