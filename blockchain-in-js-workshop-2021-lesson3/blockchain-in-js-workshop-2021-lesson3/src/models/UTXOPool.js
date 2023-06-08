import UTXO from './UTXO.js'

class UTXOPool {
    constructor(utxos = {}) {
      this.utxos = new Map()
      
      for (const utxo of Object.values(utxos)) {
        const { txHash, outputIndex, output } = utxo
        this.utxos.set(this.getUTXOID(txHash, outputIndex), new UTXO(txHash, outputIndex, output))
      }
    }
    
    // 获取UTXO池的大小
    size() {
      return this.utxos.size
    }
  
    // ...
    
    // 生成UTXO的ID
    getUTXOID(txHash, outputIndex) {
      return `${txHash}:${outputIndex}`
    }
  }
  addUTXO(tx) 
    for (let i = 0; i < tx.outputs.length; i++) {
      const utxo = new UTXO(tx.id, i, tx.outputs[i])
      this.utxos.set(this.getUTXOID(tx.id, i), utxo)
    }

  // 将当前 UXTO 的副本克隆
  clone() 
    const pool = new UTXOPool()
    for (const [id, utxo] of this.utxos) {
      pool.utxos.set(id, new UTXO(utxo.txHash, utxo.outputIndex, utxo.output))
    }
    return pool

export default UTXOPool
