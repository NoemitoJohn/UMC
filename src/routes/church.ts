import express from 'express'
import { db } from '../db/db';

const churchRoute = express.Router();

churchRoute.get('/', async (req, res, next) => {
  try {
    const getLocalChurch = await db.execute('SELECT * from local_church')
  
    res.status(200).json(getLocalChurch.rows)       
    
  } catch (error) {
    next(error)
  }

});

churchRoute.post('/', async (req, res, next) => {
  
  try {
    const addLocalChurch = await db.execute({ sql: 'INSERT INTO local_church (name) VALUES (?)', args :  [req.body.name]})
  
    res.status(200).json({id : Number(addLocalChurch.lastInsertRowid), name : req.body.name})
  
  } catch (error) {
    next(error)
  }

})

churchRoute.post('/episcopal_area', async (req, res, next) => {
  try {
    const addEpiscopalArea = await db.execute({sql : 'INSERT INTO episcopal_area (name) VALUES (?)', args: [req.body.name]})
    
    res.status(200).json({id : Number(addEpiscopalArea.lastInsertRowid), name : req.body.name})
    
  } catch (error) {
    next(error)
  }
  

})

churchRoute.get('/episcopal_area', async (req, res, next) => {
  try {
    const getEpiscopalArea = await db.execute('SELECT * FROM episcopal_area')
    res.status(200).json(getEpiscopalArea.rows)
    
  } catch (error) {
    next(error)
  }
  
  
})

churchRoute.get('/annual_conference', async(req, res, next) => {
  try {
    const getAnnualConference = await db.execute('SELECT * FROM annual_conference')
    res.status(200).json(getAnnualConference.rows)
  } catch (error) {
    next(error)
  }
  
})

churchRoute.post('/annual_conference', async (req, res, next) => {
  try {
    const addAnnualConference = await db.execute({sql : 'INSERT INTO annual_conference (name) VALUES (?)', args : [req.body.name]})
  
    res.status(200).json({id : Number(addAnnualConference.lastInsertRowid), name : req.body.name})
    
  } catch (error) {
    next(error)
  }
})

churchRoute.post('/district_conference', async (req, res, next) => {
  try {
    const addDistrictConference = await db.execute({sql : 'INSERT INTO district_conference (name) VALUES (?)', args :  [req.body.name]})
  
    res.status(200).json({id: Number(addDistrictConference.lastInsertRowid), name : req.body.name})
    
  } catch (error) {
    next(error)
  }

})

churchRoute.get('/district_conference', async (req, res, next) => {
  const getDistrictConference = await db.execute('SELECT * FROM district_conference')
  res.status(200).json(getDistrictConference.rows)
  
})


export { churchRoute }
