import UTXOPool from './UTXOPool.js'

class Blockchain {
  constructor(name, genesisBlock) {
    this.name = name
    this.blocks = new Map()
    this.utxoPool = new UTXOPool()

    this.blocks.set(genesisBlock.hash, genesisBlock)
    this.utxoPool.addBlockUTXOs(genesisBlock)
  }

  // 返回当前链上最长的区块列表
  longestChain() {
    let maxChain = []
    for (const block of this.blocks.values()) {
      const chain = [block]
      let prevBlock = block
      while (true) {
        const curBlock = this.blocks.get(prevBlock.previousBlockHash)
        if (!curBlock) {
          break
        }
        chain.push(curBlock)
        prevBlock = curBlock
      }
      if (chain.length > maxChain.length) {
        maxChain = chain
      }
    }
    return maxChain
  }

  // 判断当前区块链是否包含一个特定的区块
  containsBlock(block) {
    const curBlock = this.blocks.get(block.hash)
    return curBlock && curBlock.height === block.height
  }

  // 返回当前区块链中最高的区块
  maxHeightBlock() {
    let maxHeightBlock = null
    for (const block of this.blocks.values()) {
      if (!maxHeightBlock || maxHeightBlock.height < block.height) {
        maxHeightBlock = block
      }
    }
    return maxHeightBlock
  }

  // 添加一个新的区块到当前区块链
  _addBlock(block) {
    if (!block.isValid()) {
      throw new Error(`Block ${block.hash} is invalid`)
    }

    const prevBlock = this.blocks.get(block.previousBlockHash)
    if (!prevBlock) {
      throw new Error(`Previous block ${block.previousBlockHash} is not found`)
    }

    if (block.height !== prevBlock.height + 1) {
      throw new Error(`Invalid block height ${block.height}`)
    }

    this.utxoPool.handleBlockBlock(prevBlock, block)
    this.blocks.set(block.hash, block)
  }

  // 在当前区块链中添加新的区块
  addBlock(block) {
    try {
      this._addBlock(block)
      return true
    } catch (err) {
      console.error('Failed to add block', err)
      return false
    }
  }
}

export default Blockchain