import UTXO from './UTXO.js'

class UTXOPool {
  constructor(utxos = {}) {
    this.utxos = new Map(Object.entries(utxos))
  }

  // 将新的UTXO添加到公共池中
  addUTXO(utxo, output) {
    this.utxos.set(JSON.stringify(utxo), { utxo, output })
  }

  // 克隆一个UTXOPool
  clone() {
    const utxos = {}
    for (let [key, value] of this.utxos) {
      utxos[key] = Object.assign({}, value)
    }
    return new UTXOPool(utxos)
  }

  // 根据交易处理UTXOPool
  handleTransaction(tx) {
    // 1. 删除所有已经被花费的UTXO
    for (let i = 0; i < tx.inputs.length; i++) {
      const input = tx.inputs[i]
      const utxo = new UTXO(input.prevTxHash, input.outputIndex)
      this.removeUTXO(utxo)
    }
    // 2. 添加所有新产生的UTXO
    for (let i = 0; i < tx.outputs.length; i++) {
      const output = tx.outputs[i]
      const utxo = new UTXO(tx.hash, i)
      this.addUTXO(utxo, output)
    }
  }

  // 验证交易合法性
  isValidTransaction(tx) {
    let inputSum = 0
    let outputSum = 0
    for (let i = 0; i < tx.inputs.length; i++) {
      const input = tx.inputs[i]
      const utxo = new UTXO(input.prevTxHash, input.outputIndex)
      const output = this.getOutput(utxo)
      if (output === undefined) { // 交易输入使用了已经被花费的输出，无效
        return false
      }
      const publicKey = output.address // 假设output中包含公钥信息
      if (!this.verifySignature(tx, publicKey, i)) { // 验证输出授权的签名
        return false
      }
      inputSum += output.amount
    }
    for (let i = 0; i < tx.outputs.length; i++) {
      const output = tx.outputs[i]
      outputSum += output.amount
    }
    return inputSum >= outputSum // 交易输入所引用的UTXO总和必须大于等于交易输出
  }

  // 删除UTXO
  removeUTXO(utxo) {
    this.utxos.delete(JSON.stringify(utxo))
  }

  // 获取UTXO对应的 output
  getOutput(utxo) {
    const item = this.utxos.get(JSON.stringify(utxo))
    return item ? item.output : undefined
  }

  // 验证交易签名
  verifySignature(tx, publicKey, index) {
    // 添加验证签名代码，需要根据所使用的加密库和具体业务逻辑来实现
    return true
  }
}

export default UTXOPool