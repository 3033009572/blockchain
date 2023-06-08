import sha256 from 'crypto-js/sha256.js'

class Transaction {
  constructor(inputs, outputs) {
    this.inputs = inputs
    this.outputs = outputs
    this.timestamp = Date.now()
    this.hash = this._setHash()
  }

  // 更新交易的哈希值
  _setHash() {
    const data = this.inputs.map(input => {
      return `${input.prevTxHash}:${input.outputIndex}`
    }).join(',') + '|' + this.outputs.map(output => {
      return `${output.address}:${output.amount}`
    }).join(',') + '|' + this.timestamp.toString()
    return sha256(data).toString()
  }

  // 计算交易 hash 的摘要函数
  _calculateHash() {
    const data = this.inputs.map(input => {
      return `${input.prevTxHash}:${input.outputIndex}`
    }).join(',') + '|' + this.outputs.map(output => {
      return `${output.address}:${output.amount}`
    }).join(',')
    return sha256(data).toString()
  }
}

export default Transaction