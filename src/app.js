// ------------------------------------------------------------------------------
require('source-map-support').install()
import 'app-module-path/register'
import Server from './server'

// ------------------------------------------------------------------------------
// global libarary setting
global._ = require('lodash')
require('date-utils')
global.hostname = require('os').hostname()

// logger setting
var winston = require('winston')
let logLevel = (process.env.NODE_ENV || 'development') === 'development' ? 'debug' : 'warn'
global.logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: logLevel,
      colorize: 'level'
    })
  ]
})

// ------------------------------------------------------------------------------
// load config
logger.warn(`load config start =====================================`)
var Config = require('./config/config')
var config = global.config = new Config()
logger.warn(`load config ended =====================================\n`)

// ------------------------------------------------------------------------------
// db
var mongoose = require('mongoose')
global.mongoose = mongoose.connect(config.mongo.url)
mongoose.Promise = require('bluebird')

// ------------------------------------------------------------------------------
// start
logger.warn(`>>> Server Start at ${__dirname} <<<`)

new Server().start()
