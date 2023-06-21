import UTXO from './UTXO.js'

class UTXOPool {
  constructor(utxos = {}) {
    this.utxos = new Map()
    for (let [hash, utxo] of Object.entries(utxos)) {
      this.utxos.set(hash, utxo)
    }
  }

  addUTXO(publicKey, amount) {
    const utxo = new UTXO(publicKey, amount)
    this.utxos.set(utxo.toString(), utxo)
  }

  clone() {
    return new UTXOPool(Object.fromEntries(this.utxos.entries()))
  }

  // 处理交易函数
  handleTransaction(transaction) {
    const inputUTXOs = transaction.inputs.map(input => this.getUTXO(input.preTxHash, input.outputIndex))
    const allInputsAreUnspent = inputUTXOs.every(utxo => !!utxo)
    if (!allInputsAreUnspent) {
      return false
    }
  
    const isAllSignatureValid = transaction.inputs.every(input => {
      const { preTxHash, outputIndex, signature, publicKey } = input
      const txHash = transaction._calculateHash()
      return CryptoJS.ECDSA.verify(CryptoJS.SHA256(txHash), signature, publicKey)
    })
  
    if (!isAllSignatureValid) {
      return false
    }
  
    inputUTXOs.forEach(utxo => this.utxos.delete(utxo.toString()))
  
    const newUTXOs = transaction.outputs.map((output, index) => {
      const utxo = new UTXO(output.address, output.value, transaction.hash, index)
      return [utxo.toString(), utxo]
    })
    this.utxos = new Map([...this.utxos, ...newUTXOs])
  
    return true
  }

  // 验证交易合法性
  /**
   * 验证余额
   * 返回 bool
   */
  isValidTransaction(transaction) {
    const inputUTXOs = transaction.inputs.map(input => this.getUTXO(input.preTxHash, input.outputIndex))
    const allInputsAreUnspent = inputUTXOs.every(utxo => !!utxo)
    if (!allInputsAreUnspent) {
      return false
    }
  
    const totalInputAmount = inputUTXOs.reduce((total, utxo) => total + utxo.value, 0)
    const totalOutputAmount = transaction.outputs.reduce((total, output) => total + output.value, 0)
    if (totalInputAmount < totalOutputAmount) {
      return false
    }
  
    const isAllSignatureValid = transaction.inputs.every(input => {
      const { preTxHash, outputIndex, signature, publicKey } = input
      const txHash = transaction._calculateHash()
      return CryptoJS.ECDSA.verify(CryptoJS.SHA256(txHash), signature, publicKey)
    })
  
    return isAllSignatureValid
  }
}
export default UTXOPool
