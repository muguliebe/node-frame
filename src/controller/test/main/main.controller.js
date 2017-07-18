exports.init = function (app, router) {
  logger.debug(`main router bind start`)
  router.get('/', getHome)
}

const getHome = (req, res) => {
  res.json('alive')
}
