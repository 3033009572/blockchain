export default class UTXO {
  constructor(txHash, outputIndex) {
    this.txHash = txHash
    this.outputIndex = outputIndex
  }

  // 判断两个UTXO对象是否相等
  equals(utxo) {
    return utxo !== null &&
      utxo.txHash === this.txHash &&
      utxo.outputIndex === this.outputIndex
  }
}