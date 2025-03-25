import express from 'express'
import { PUBLIC_PATH, VIEW_PATH } from './constant'
import { indexRoute } from './routes';
import helmet from 'helmet';
import cookieParser  from 'cookie-parser' 
import { authRouter } from './routes/auth';
// import multer from 'multer';
import bodyParser from 'body-parser';
import { userRouter } from './routes/user';
import { churchRoute } from './routes/church';
import { adminUserRouter } from './routes/admin/users';

const app = express()

app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(cookieParser())
app.use(helmet({
  contentSecurityPolicy : {
    directives: {
      'script-src' : ["'self'", 'https://cdn.jsdelivr.net/', 'https://cdnjs.cloudflare.com/', 'https://cdn.datatables.net/'],
      'img-src' : ["'self'", 'data:', 'blob:'],
      'default-src' : ["'self'", 'blob:', 'https:']
    }
  }
}))

const PORT = process.env.PORT || 8000

app.set('view engine', 'ejs');
app.set('views', VIEW_PATH);

app.use('/public', express.static(PUBLIC_PATH)) 

app.use('/', indexRoute)
app.use('/auth', authRouter)
app.use('/church', churchRoute)
app.use('/admin/users', adminUserRouter)
app.use('/user', userRouter)


app.use((req, res, next) => {
  res.render('404')
  console.log('Not found!')
})

app.listen(PORT, () => {
  // connection.destroy()
  // connection.connect((err) => {
  //   if(err) { 
  //     console.error('error connecting database: ' + err.stack)
  //     return;
  //   }
  //   console.log('database connected as id ' + connection.threadId);
  // })

  console.log(`running server in port http://localhost:${PORT}`)

})