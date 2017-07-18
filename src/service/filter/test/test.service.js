export default class TestService {
  constructor () {
    logger.debug('TestService constructor called')
  }

  static getTest () {
    return JSON.stringify({success: true})
  }
}
