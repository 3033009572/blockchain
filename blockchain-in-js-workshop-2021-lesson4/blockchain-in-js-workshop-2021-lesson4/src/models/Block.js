import sha256 from 'crypto-js/sha256.js'

export const DIFFICULTY = 2

class Block {
  constructor(version, timestamp, transactions, previousBlockHash, merkleRoot, nonce, difficulty) {
    this.version = version
    this.timestamp = timestamp
    this.transactions = transactions
    this.previousBlockHash = previousBlockHash
    this.merkleRoot = merkleRoot
    this.nonce = nonce
    this.difficulty = difficulty
  }

  // 检查Block的有效性
  isValid() {
    const hash = this.calculateHash()
    return (
      hash.substring(0, this.difficulty) === Array(this.difficulty + 1).join('0') &&
      hash === this.calculateHash()
    )
  }

  // 设置Nonce值
  setNonce(nonce) {
    this.nonce = nonce
  }

  // 计算Block的哈希值
  calculateHash() {
    const data = `${this.version}${this.timestamp}${this.transactions}${this.previousBlockHash}${this.merkleRoot}${this.nonce}`
    return sha256(data).toString()
  }
}

export default Block