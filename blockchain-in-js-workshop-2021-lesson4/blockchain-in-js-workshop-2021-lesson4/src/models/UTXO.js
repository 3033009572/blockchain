class UTXO {
  constructor(txHash, outputIndex) {
    this.txHash = txHash
    this.outputIndex = outputIndex
  }

  // 比较两个UTXO是否相同
  equals(other) {
    return this.txHash === other.txHash && this.outputIndex === other.outputIndex
  }
}

export default UTXO