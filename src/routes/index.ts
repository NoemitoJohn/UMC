import express from 'express';
import { getIndex } from '../controller';
import { isAuthenticate } from '../lib/middleware';

const indexRoute = express.Router()

indexRoute.get('/', isAuthenticate, getIndex)

export {indexRoute}