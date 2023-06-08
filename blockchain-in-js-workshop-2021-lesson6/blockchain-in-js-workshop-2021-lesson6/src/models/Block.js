import sha256 from 'crypto-js/sha256.js'
import MerkleTree from './MerkleTree.js'

export const DIFFICULTY = 2

class Block {
  constructor(transactions, previousBlockHash) {
    this.timestamp = Date.now()
    this.transactions = transactions
    this.previousBlockHash = previousBlockHash
    this.nonce = 0
    this.hash = this._setHash()
    this.merkleTree = new MerkleTree(this.transactions)
    this.combinedTransactionsHash = this.merkleTree.toString()
  }

  // 校验区块是否合法
  isValid() {
    // 校验区块时间戳是否合理，可以限制区块是否生成过快或过慢
    if (Date.now() - this.timestamp > 1000 * 60 * 10) { // 十分钟
      return false
    }

    // 校验区块的 Hash 是否符合难度要求
    if (this.hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY)) {
      return false
    }

    // 校验默克尔树根节点的哈希是否和区块存储的一致
    if (this.combinedTransactionsHash !== this.merkleTree.toString()) {
      return false
    }

    return true
  }

  // 更新nonce值并重新计算hash
  setNonce(nonce) {
    this.nonce = nonce
    this.hash = this._setHash()
  }

  // 计算区块的哈希值
  _setHash() {
    const data = this.previousBlockHash +
      this.timestamp.toString() +
      JSON.stringify(this.transactions) +
      this.nonce.toString()
    return sha256(data).toString()
  }

  // 计算区块中所有交易的 Merkle 树根哈希
  combinedTransactionsHash() {
    return this.merkleTree.toString()
  }

  // 添加交易到区块中，并更新区块的 combinedTransactionsHash
  addTransaction(transaction) {
    this.transactions.push(transaction)
    this.merkleTree = new MerkleTree(this.transactions)
    this.combinedTransactionsHash = this.merkleTree.toString()
  }
}

export default Block