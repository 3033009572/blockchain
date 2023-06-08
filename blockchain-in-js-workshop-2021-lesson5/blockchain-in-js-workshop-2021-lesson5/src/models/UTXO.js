export default class UTXO {
  constructor(txid, index, value) {
    this.txid = txid
    this.index = index
    this.value = value
  }

  // 判断一个UTXO对象是否与一个交易输出匹配
  match(txOutput) {
    return this.txid === txOutput.txid && this.index === txOutput.index
  }

  // 判断两个UTXO对象是否相等
  equals(utxo) {
    return this.txid === utxo.txid && this.index === utxo.index && this.value === utxo.value
  }
}