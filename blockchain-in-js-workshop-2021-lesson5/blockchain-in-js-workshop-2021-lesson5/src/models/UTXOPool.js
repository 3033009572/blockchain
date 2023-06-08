import UTXO from './UTXO.js'

class UTXOPool {
  constructor(utxos = {}) {
    this.utxos = new Map()
    for (const [txid, outputs] of Object.entries(utxos)) {
      for (let i = 0; i < outputs.length; i++) {
        const output = outputs[i]
        const utxo = new UTXO(txid, i, output.value, output.script)
        this.utxos.set(utxo.hash, utxo)
      }
    }
  }

  // 添加一个新的UTXO对象
  addUTXO(publicKey, amount) {
    const utxo = new UTXO(publicKey, amount)
    this.utxos.set(utxo.hash, utxo)
  }

  // 克隆一个UTXOPool对象
  clone() {
    return new UTXOPool([...this.utxos.values()])
  }

  // 处理交易
  handleTransaction(transaction) {
    for (const input of transaction.inputs) {
      const utxo = this.utxos.get(input.hash)
      if (!utxo) {
        console.error(`UTXO ${input.hash} not found`)
        return false
      }
      transaction.inputs.value += utxo.value
      this.utxos.delete(input.hash)
    }

    for (let i = 0; i < transaction.outputs.length; i++) {
      const output = transaction.outputs[i]
      const utxo = new UTXO(transaction.hash, i, output.value, output.script)
      this.utxos.set(utxo.hash, utxo)
    }

    return true
  }

  // 验证交易合法性
  isValidTransaction(transaction) {
    let inputSum = 0
    for (const input of transaction.inputs) {
      const utxo = this.utxos.get(input.hash)
      if (!utxo || !utxo.match(input)) {
        return false
      }
      inputSum += utxo.value
    }

    let outputSum = 0
    for (const output of transaction.outputs) {
      outputSum += output.value
    }

    return inputSum >= outputSum
  }
}

export default UTXOPool