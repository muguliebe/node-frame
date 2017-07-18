import crypto from 'crypto'
import security from 'config/security.json'
const algorithm = 'aes192'
const inEncoding = 'utf8'
const outEncoding = 'base64'

export const encrypt = (val) => {
  let cipher = crypto.createCipher(algorithm, security.key)
  let result = cipher.update(val, inEncoding, outEncoding)
  result += cipher.final(outEncoding)
  return result
}

export const decrypt = (val) => {
  let decipher = crypto.createDecipher(algorithm, security.key)
  let result = decipher.update(val, outEncoding, inEncoding)
  result += decipher.final(inEncoding)
  return result
}
