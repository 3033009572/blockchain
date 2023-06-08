import sha256 from 'crypto-js/sha256.js'

export const DIFFICULTY = 2

//计算梅克尔树根
function merkleRoot(arr) {
  if (arr.length === 0) return ''
  if (arr.length === 1) return arr[0]
  const newarr = []
  for (let i = 0; i < arr.length; i += 2) {
    const s1 = arr[i]
    const s2 = i < arr.length - 1 ? arr[i + 1] : ''
    newarr.push(sha256(s1 + s2).toString())
  }
  return merkleRoot(newarr)
}

class Block {
  constructor(height, previousBlockHash, timestamp, transactions, nonce = 0, difficulty = DIFFICULTY) {
    this.height = height
    this.previousBlockHash = previousBlockHash
    this.timestamp = timestamp
    this.transactions = transactions
    this.nonce = nonce
    this.difficulty = difficulty
    this.hash = this._setHash()
  }

  // 检查当前区块是否有效
  isValid() {
    if (this.hash !== this._setHash()) {
      return false
    }
    if (this.hash.substring(0, this.difficulty) !== '0'.repeat(this.difficulty)) {
      return false
    }
    return true
  }

  // 设置当前区块的nonce
  setNonce(nonce) {
    this.nonce = nonce
    this.hash = this._setHash()
  }

  // 更新区块哈希值
  _setHash() {
    const txHash = this.combinedTransactionsHash()
    const data = this.height + this.previousBlockHash + this.timestamp + txHash + this.nonce + this.difficulty
    return sha256(data).toString()
  }

  // 合并计算区块中所有交易的哈希值
  combinedTransactionsHash() {
    const txHashes = this.transactions.map(tx => tx.hash)
    return merkleRoot(txHashes)
  }
    addTransaction(tx, utxoPool) {
      if (!tx.isValid()) {
        throw new Error('Transaction is invalid')
      }
      if (!utxoPool.isValidTransaction(tx)) {
        throw new Error('Transaction is invalid in current UTXO pool')
      }
      this.transactions.push(tx)
      utxoPool.handleTransaction(tx)
      this.hash = this._setHash()
    }
  }
  
  export default Block