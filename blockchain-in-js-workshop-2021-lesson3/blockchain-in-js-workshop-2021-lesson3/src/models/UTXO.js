export default class UTXO {
  constructor(txHash, outputIndex, output) {
    this.txHash = txHash
    this.outputIndex = outputIndex
    this.output = output
  }

  // 获取UTXO值
  getValue() {
    return this.output.value
  }
}
