import express from 'express'
import { PUBLIC_PATH, VIEW_PATH } from './constant'
import { indexRoute } from './routes';
import helmet from 'helmet';
import cookieParser  from 'cookie-parser' 
import { authRouter } from './routes/auth';
// import multer from 'multer';
import bodyParser from 'body-parser';
import { userRouter } from './routes/user';

const app = express()

app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(cookieParser())
app.use(helmet({
  contentSecurityPolicy : {
    directives: {
      'script-src' : ["'self'", 'https://cdn.jsdelivr.net/', 'https://cdnjs.cloudflare.com/'],
      'img-src' : ["'self'", 'data:', 'blob:']
    }
  }
}))

const PORT = process.env.PORT || 8000

app.set('view engine', 'ejs');
app.set('views', VIEW_PATH);

app.use('/public', express.static(PUBLIC_PATH)) 

app.use('/', indexRoute)
app.use('/auth', authRouter)
app.use('/user', userRouter)


app.use((req, res, next) => {
  res.render('404')
  console.log('Not found!')
})

app.listen(PORT, () => {
  console.log(`running server in port http://localhost:${PORT}`)
})