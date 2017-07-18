import crypto from 'util/crypto'
import TestService from '../../service/filter/test/test.service'

exports.init = function (app, router) {
  logger.debug(`test router bind start`)
  router.get('/test/encrypt/:val', encrypt)
  router.get('/test/decrypt/:val', decrypt)
  router.get('/test/alive', alive)
  router.get('/test', test)
}

const encrypt = (req, res) => {
  let afterCrypt = crypto.encrypt(req.params.val)
  res.json(afterCrypt)
}

const decrypt = (req, res) => {
  let afterCrypt = crypto.decrypt(req.params.val)
  res.json(afterCrypt)
}

const alive = (req, res) => {
  res.json('alive')
}

const test = (req, res) => {
  res.json(TestService.getTest())
}
