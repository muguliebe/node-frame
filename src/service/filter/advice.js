import { Address6 } from 'ip-address'
import Transaction from 'model/transaction'

export const allAround = (headerName) => {
  return (req, res, next) => {
    // before tran  ====================================================
    let ip = new Address6(req.ip).inspectTeredo().client3
    logger.info(`Start => [from ${ip}] ${req.url.substr(0, 40)} =================================================`)

    let start = new Date()
    let end = res.end
    res.end = function (payload) {
      end.apply(res, arguments)  // wait for transaction

      // after  tran  ==================================================
      let endDate = new Date()
      let elapsed = endDate - start

      // - calc human size
      let size = res.get('Content-Length')
      if (size < 1024) {
        size = size + ' bytes'
      } else if (size >= 1024 && size < 1024 * 1024) {
        size = parseInt(size / 1024) + ' kbytes'
      } else if (size >= 1024 * 1024) {
        size = parseInt(size / 1024 / 1024) + ' MB'
      }

      logger.info(`End      [to   ${ip}] ${req.url.substr(0, 40)} [${elapsed} ms] [delived ${size}] [with ${res.statusCode}: ${res.statusMessage}]`)

      // - store trnasaction information to db =========================
      //   except tran: /_ah/health
      if (req.url === '/_ah/health') {
        return
      }
      let newTran = Transaction({
        day: endDate.toFormat('YYMMDD'),
        time: endDate.toFormat('HH24MISS'),
        url: req.url,
        ip: ip,
        responseTime: elapsed + '',
        status: res.statusCode,
        message: res.message,
        contentLength: res.get('Content-Length') + '',
        hostname: hostname,
        sid: req.sessionID
      })

      let startAt = process.hrtime()
      newTran.save().then(() => {
        let diff = process.hrtime(startAt)
        let elapsed2 = diff[0] * 1e3 + diff[1] * 1e-6
        logger.silly(`tran save :${elapsed2} ms`)
      })
    }
    next()
  }
}
