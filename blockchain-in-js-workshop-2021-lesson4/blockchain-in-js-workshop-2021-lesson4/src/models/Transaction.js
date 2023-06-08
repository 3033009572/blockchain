import sha256 from 'crypto-js/sha256.js'

class Transaction {
  constructor(inputs, outputs) {
    this.inputs = inputs
    this.outputs = outputs
    this.hash = ''
  }

  // 计算当前交易的 hash 值
  _setHash() {
    this.hash = this._calculateHash()
  }

  // 根据交易类型(普通交易或挖矿奖励),计算交易摘要(hash)
  _calculateHash() {
    const data = []
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i]
      data.push(input.prevTxHash, input.outputIndex, input.address.publicKeyString)
    }
    for (let i = 0; i < this.outputs.length; i++) {
      const output = this.outputs[i]
      data.push(output.address.publicKeyString, output.amount)
    }
    return sha256(data.join('')).toString()
  }

  // 检查当前交易的有效性
  isValid() {
    if (this.hash !== this._calculateHash()) {
      return false
    }
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i]
      if (!input.isValid()) {
        return false
      }
    }
    for (let i = 0; i < this.outputs.length; i++) {
      const output = this.outputs[i]
      if (output.amount <= 0) {
        return false
      }
    }
    return true
  }
}

export default Transaction