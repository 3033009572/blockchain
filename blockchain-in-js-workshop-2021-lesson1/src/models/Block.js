import crypto from 'crypto'
import sha256 from 'crypto-js/sha256.js'


class Block {
  constructor(index, data, previousHash) {
    this.index = index
    this.timestamp = new Date()
    this.data = data
    this.previousHash = previousHash
    this.hash = this.calculateHash()
  }

  calculateHash() {
    const dataString = this.index + this.timestamp + this.data + this.previousHash
    const hash = crypto.createHash('sha256')
    hash.update(dataString)
    return hash.digest('hex')
  }

  getIndex() {
    return this.index
  }

  getHash() {
    return this.hash
  }
}

export default Block