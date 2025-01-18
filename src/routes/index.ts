import express from 'express';
import { getIndex } from '../controller';


const indexRoute = express.Router()


indexRoute.get('/', getIndex)


export {indexRoute}