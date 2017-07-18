import winston from 'winston'
import { hostname } from 'os'
import 'date-utils'
import lodash from 'lodash'
import 'source-map-support'
import 'app-module-path/register'
import bluebird from 'bluebird'
import mongoose from 'mongoose'
import Server from './server'
import Config from './config/config'

// -----------------------------------------------------------------------------
// global library setting
// -----------------------------------------------------------------------------
global._ = lodash
global.hostname = hostname()

// -----------------------------------------------------------------------------
// set Logger
// -----------------------------------------------------------------------------
let logLevel = (process.env.NODE_ENV || 'development') === 'development' ? 'debug' : 'warn'
global.logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: logLevel,
      colorize: 'level'
    })
  ]
})

// -----------------------------------------------------------------------------
// load config
// -----------------------------------------------------------------------------
logger.warn(`load config start =====================================`)
const config = global.config = new Config()
logger.warn(`load config ended =====================================\n`)

// -----------------------------------------------------------------------------
// db
// -----------------------------------------------------------------------------
global.mongoose = mongoose.connect(config.mongo.url)
mongoose.Promise = bluebird

// -----------------------------------------------------------------------------
// start
// -----------------------------------------------------------------------------
logger.warn(`>>> Server Start at ${__dirname} <<<`)
new Server().start()
