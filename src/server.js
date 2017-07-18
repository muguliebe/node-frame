import * as advice from './service/filter/advice'
import path from 'path'
import express from 'express'
import readReadSync from 'recursive-readdir-sync'
import bodyParser from 'body-parser' // parses information from POST
import cookieParser from 'cookie-parser'
import responseTime from 'response-time' // set header X-Response-Time
import session from 'express-session'
import connectMongo from 'connect-mongo'
import { Server } from 'http'
const router = express.Router()
const app = express()
const server = Server(app)
const MongoStore = connectMongo(session)

export default class AppServer {
  constructor () {
    logger.warn(`server prepare start =====================================`)

    // =========================================================================
    // default setting
    // =========================================================================
    app.use(cookieParser())
    app.use(bodyParser())
    app.use(session({
      secret: 'test',
      cookieName: 'session',
      store: new MongoStore({
        cookie: {maxAge: 1000 * 60 * 2},
        mongooseConnection: mongoose.connection,
        ttl: 1 * 60 * 60 // 1 hours
      })
    }))
    app.use((req, res, next) => {
      req.session.ssid = req.session.sid
      next()
    })

    // cors ====================================================================
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', req.get('Origin') || '*')
      // res.header('Origin'     , req.get('Origin') || '*'                                        )
      res.header('Access-Control-Allow-Credentials', 'true')
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
      res.header('Access-Control-Expose-Headers', 'Content-Length')
      res.header('Access-Control-Allow-Headers', 'Origin, Accept, Authorization, Content-Type, X-Requested-With, Range')
      res.header('Access-Control-Max-Age', 1728000)
      if (req.method === 'OPTIONS') {
        return res.status(200).send('?')
      } else {
        return next()
      }
      // next()
    })

    // router ==================================================================
    app.use(router)
    router.use(responseTime()) // append header 'X-Response-Time'
    router.use(advice.allAround()) // advice and store db with tran info

    // =========================================================================
    // route bind
    // controller 폴더를 loop 돌며 각 파일의 init() 함수를 호출
    // =========================================================================
    app.get('/', function (req, res) {
      res.json(`alive with ${process.env.NODE_ENV}`)
    })

    try {
      const controllers = path.join(__dirname, './controller/')
      logger.info(`controller(routes) bind start at ${controllers}`)
      readReadSync(controllers)
        .filter(file => {
          return file.split('.').pop() === 'js'
        })
        .forEach(function (file) {
          try {
            logger.info(`route bind: ${file}`)
            require(file).init(app, router)
          } catch (err) {
            logger.error(`mount controller err occured at ${file}\n\t ${err}`)
          }
        })
    } catch (err) {
      logger.error(`err occured: ${err}`)
    }

    // logging
    logger.warn(`server prepare start =====================================`)
    logger.warn(`current environment NODE_ENV  : ${process.env.NODE_ENV}`)
    logger.warn(`current environment Mongo  URI: ${config.mongo.ip}`)
    logger.warn(`server prepare ended =====================================\n`)
  }

  start () {
    logger.info(`current port ${process.env.PORT || 3001}`)
    return app.listen(process.env.PORT || 3001)
  }
}
