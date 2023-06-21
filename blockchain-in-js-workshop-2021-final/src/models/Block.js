import sha256 from 'crypto-js/sha256.js'

export const DIFFICULTY = 2

class Block {
  // 1. 完成构造函数及其参数

  constructor(transactions, previousHash, timestamp = Date.now()) {
    this.timestamp = timestamp // 区块创建时间戳
    this.transactions = transactions // 交易列表
    this.previousHash = previousHash // 上一个区块的 Hash 值
    this.nonce = 0 // 工作量证明中使用的计数器
    this.hash = this._setHash()
  }

  isValid() {
    const target = "0".repeat(DIFFICULTY)
    return this.hash.slice(0, DIFFICULTY) === target && this.hash === this._setHash()
  }

  setNonce(nonce) {
    this.nonce = nonce
    this.hash = this._setHash()
  }

  // 根据交易变化更新区块 hash
  _setHash() {
    const message = JSON.stringify(this.transactions) + this.previousHash + this.timestamp + this.nonce
    return sha256(message).toString()
  }

  // 汇总计算交易的 Hash 值
  /**
   * 默克尔树实现
   */
  combinedTransactionsHash() {
    const merkleTree = []
    for (let t of this.transactions) {
      merkleTree.push(sha256(JSON.stringify(t)))
    }
    while (merkleTree.length > 1) {
      const newLevel = []
      for (let i = 0; i < merkleTree.length; i += 2) {
        const left = merkleTree[i]
        const right = i + 1 < merkleTree.length ? merkleTree[i + 1] : left // 处理奇数个节点的情况
        newLevel.push(sha256(left + right))
      }
      merkleTree.splice(0, merkleTree.length) // 将当前的层级节点替代原来的数组
      merkleTree.push(newLevel) // 将新层级节点添加到默克尔树中
      }
      return merkleTree[0]
      }

  // 添加交易到区块
  /**
   *
   * 需包含 UTXOPool 的更新与 hash 的更新
   */
  addTransaction(transaction, utxoPool) {
    if (!transaction.isValid()) return
    const inputUTXOs = transaction.inputs
      .map(input => utxoPool.getUTXO(input.preTxHash, input.outputIndex))
      .filter(utxo => !!utxo)
  
    if (!transaction.isValidInputUTXOs(inputUTXOs)) return
  
    const changedUTXOs = transaction.apply() // 获取交易变化的 UTXO 列表
    changedUTXOs.forEach(utxo => utxoPool.addUTXO(utxo)) // 更新 UTXO 池
  
    this.transactions.push(transaction) // 添加到交易列表
    this._setHash() // 重新计算 hash 值
  }

  // 添加签名校验逻辑
  isValidTransaction(transaction) {
    const inputUTXOs = transaction.inputs
      .map(input => this.utxoPool.getUTXO(input.preTxHash, input.outputIndex))
      .filter(utxo => !!utxo)
  
    if (!transaction.isValidInputUTXOs(inputUTXOs)) return false
  
    const outputSum = transaction.outputs.reduce((sum, output) => sum + output.value, 0)
    const inputSum = inputUTXOs.reduce((sum, utxo) => sum + utxo.value, 0)
    if (inputSum < outputSum) return false
  
    return true
  }
}

export default Block
