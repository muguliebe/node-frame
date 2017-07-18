const crypto = require('util/crypto')
const security = require('config/security.json')

module.exports = function () {
  return new Config()

  function Config () {
    // init
    process.env.NODE_ENV = (process.env.NODE_ENV && (process.env.NODE_ENV).trim().toLowerCase() === 'production')
      ? 'production'
      : 'development'
    let mode = process.env.NODE_ENV || 'development'
    logger.warn(`Config load start mode on ${mode}`)

    // load props
    let props = require('./properties.prod.json')
    if (mode === 'development') {
      props = require('./properties.dev.json')
    }

    // security
    this.security = security

    // db
    // let password = crypto.decrypt(props.mongo.password)
    let password = props.mongo.password
    props.mongo.url = `mongodb://${props.mongo.user}:${password}@${props.mongo.ip}:${props.mongo.port}/${props.mongo.database}`
    this.mongo = props.mongo
  }
}
