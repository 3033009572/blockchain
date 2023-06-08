import sha256 from 'crypto-js/sha256.js'

class Transaction {
  constructor(inputs = [], outputs = []) {
    this.inputs = inputs
    this.outputs = outputs
    this.hash = this._setHash()
  }

  // 更新交易的哈希值
  _setHash() {
    const data = JSON.stringify(this.inputs) + JSON.stringify(this.outputs)
    return sha256(data).toString()
  }

  // 计算交易哈希的摘要函数
  _calculateHash() {
    return sha256(this.hash).toString()
  }
}

export default Transaction