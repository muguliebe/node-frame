import mongoose from 'mongoose'
const Schema = mongoose.Schema

const schema = new Schema({
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

const Transaction = mongoose.model('Transaction', schema, 'transaction')
export default Transaction
