import UTXOPool from './UTXOPool.js'

class Blockchain {
  constructor(name, genesisBlock) {
    this.name = name
    this.blockchain = new Map()

    if (genesisBlock === null) {
      throw new Error('genesis block must not be null')
    }

    this.blockchain.set(genesisBlock.hash, genesisBlock)
    this.utxoPool = new UTXOPool(genesisBlock.combinedTransactions)
  }

  // 返回当前链中最长的区块信息列表
  longestChain() {
    let maxChain = []
    for (let [hash, block] of this.blockchain) {
      const chain = this.getBlockChain(block.hash)
      if (chain.length > maxChain.length) {
        maxChain = chain
      }
    }
    return maxChain
  }

  // 获取某一个区块的完整区块链(从该区块到祖先区块)
  getBlockChain(hash) {
    let chain = [this.blockchain.get(hash)]
    let previousHash = hash
    while (previousHash !== null && this.blockchain.has(previousHash)) {
      const block = this.blockchain.get(previousHash)
      previousHash = block.previousBlockHash
      if (previousHash !== null && this.blockchain.has(previousHash)) {
        chain.unshift(this.blockchain.get(previousHash))
      }
    }
    return chain
  }

  // 判断当前区块链是否包含指定区块
  containsBlock(block) {
    return this.blockchain.has(block.hash)
  }

  // 获得区块高度最高的区块
  maxHeightBlock() {
    let maxHeight = -1
    let maxHeightBlock = null
    for (let [hash, block] of this.blockchain) {
      if (block.height > maxHeight) {
        maxHeight = block.height
        maxHeightBlock = block
      }
    }
    return maxHeightBlock
  }

  // 添加区块到 blockchain 中
  _addBlock(block) {
    if (!block.isValid()) return // 校验区块是否合法
    if (this.containsBlock(block)) return // 去重，如果已经包含该区块，不添加

    // 更新UTXO池
    for (let i = 0; i < block.transactions.length; i++) {
      const tx = block.transactions[i]
      // 删除该交易的所有已使用UTXO
      for (let j = 0; j < tx.inputs.length; j++) {
        const input = tx.inputs[j]
        const utxo = new UTXO(input.prevTxHash, input.outputIndex)
        this.utxoPool.removeUTXO(utxo)
      }
      // 添加该交易的所有新UTXO
      for (let j = 0; j < tx.outputs.length; j++) {
        const output = tx.outputs[j]
        const utxo = new UTXO(tx.hash, j)
        this.utxoPool.addUTXO(utxo, output)
      }
    }

    this.blockchain.set(block.hash, block)
  }

}

export default Blockchain