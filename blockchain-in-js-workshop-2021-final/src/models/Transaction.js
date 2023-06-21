import sha256 from 'crypto-js/sha256.js'

class Transaction {
  constructor(inputs, outputs) {
    this.inputs = inputs
    this.outputs = outputs
    this.timestamp = Date.now()
    this.hash = this._setHash()
  }

  // 更新交易 hash
  _setHash() {
    this.hash = this._calculateHash()
  }

  // 计算交易 hash 的摘要函数
  _calculateHash() {
    const message = JSON.stringify({
      inputs: this.inputs,
      outputs: this.outputs,
      timestamp: this.timestamp
    })
    return sha256(message).toString()
  }

  // 校验交易签名 返回 bool 类型的值
  hasValidSignature() {
    // 获取所有输入对应的 UTXO
    const inputUTXOs = this.inputs.map(input => utxoPool.getUTXO(input.preTxHash, input.outputIndex))
    // 检查对应的 UTXO 是否未花费
    const isAllUtxoUnspent = inputUTXOs.every(utxo => !!utxo)
    if (!isAllUtxoUnspent) {
      return false
    }
    // 检查输入签名是否匹配对应的公钥
    const isAllSignatureValid = this.inputs.every(input => {
      const { preTxHash, outputIndex, signature, publicKey } = input
      const txHash = this._calculateHash()
      return CryptoJS.ECDSA.verify(CryptoJS.SHA256(txHash), signature, publicKey)
    })
    return isAllSignatureValid
  }

}

export default Transaction
