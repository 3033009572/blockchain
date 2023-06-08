import UTXO from './UTXO.js'

class UTXOPool {
  constructor(utxos = {}) {
    this.utxos = new Map()
    for (let utxo of Object.keys(utxos)) {
      const output = utxos[utxo]
      this.utxos.set(JSON.stringify(utxo), output)
    }
  }

  // 添加一个新的UTXO
  addUTXO(utxo, output) {
    this.utxos.set(JSON.stringify(utxo), output)
  }

  // 返回UTXO池的副本
  clone() {
    const copy = new UTXOPool()
    for (let utxo of this.utxos.keys()) {
      copy.utxos.set(utxo, this.utxos.get(utxo))
    }
    return copy
  }

  // 处理一次交易
  handleTransaction(tx) {
    // 将交易中花费的UTXO从UTXO池中删除
    for (let input of tx.inputs) {
      const utxo = new UTXO(input.prevTxHash, input.outputIndex)
      this.utxos.delete(JSON.stringify(utxo))
    }
    // 将交易中新增的UTXO添加到UTXO池中
    for (let i = 0; i < tx.outputs.length; i++) {
      const output = tx.outputs[i]
      const utxo = new UTXO(tx.calculateHash(), i)
      this.utxos.set(JSON.stringify(utxo), output)
    }
  }

  // 检查交易的有效性
  isValidTransaction(tx) {
    let inputSum = 0
    let outputSum = 0

    for (let input of tx.inputs) {
      const utxo = new UTXO(input.prevTxHash, input.outputIndex)
      const output = this.utxos.get(JSON.stringify(utxo))
      // 检查输入UTXO是否存在，能否使用
      if (!output) {
        return false
      }
      if (!output.address.equals(input.address)) {
        return false
      }
      inputSum += output.amount
    }

    for (let output of tx.outputs) {
      if (output.amount <= 0) return false
      outputSum += output.amount
    }

    return inputSum >= outputSum
  }
}

export default UTXOPool