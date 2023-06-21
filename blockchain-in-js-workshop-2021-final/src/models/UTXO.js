export default class UTXO {
  constructor(address, value, txHash, outputIndex) {
    this.address = address // 收款地址
    this.value = value // 未花费金额
    this.txHash = txHash // 包含 UTXO 的交易 hash 值
    this.outputIndex = outputIndex // 包含 UTXO 的交易输出索引
  }
  equals(other) {
    return other instanceof UTXO &&
      other.address === this.address &&
      other.value ===this.value &&
      other.txHash === this.txHash &&
      other.outputIndex === this.outputIndex
      }
      toString() {
        const str = `${this.address}:${this.value}:${this.txHash}:${this.outputIndex}`
        return str
      }
      static fromString(str) {
        const [address, value, txHash, outputIndex] = str.split(':')
        return new UTXO(address, Number(value), txHash, Number(outputIndex))
      }
      static getUTXO(transaction, index) {
        const output = transaction.outputs[index]
        return new UTXO(output.address, output.value, transaction.hash, index)
      }
      static toStringArray(utxos) {
        return utxos.map(utxo => utxo.toString())
      }
      static fromStringArray(strs) {
        return strs.map(str => UTXO.fromString(str))
      }
}
