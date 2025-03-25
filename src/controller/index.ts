import { Response, Request } from "express"

export const getIndex = async (req : Request, res : Response ) => {
  res.render('pages/index') 
}