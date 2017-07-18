var mongoose = require('mongoose')
var Schema = mongoose.Schema

var schema = new Schema({
  day: String,
  time: String,
  url: String,
  ip: String,
  host: String,
  hostname: String,
  responseTime: String,
  status: String,
  message: String,
  contentLength: String,
  createdAt: {type: Date, expires: 60 * 5, default: Date.now} // expires 5 min
})

var Transaction = mongoose.model('Transaction', schema, 'transaction')
module.exports = Transaction
