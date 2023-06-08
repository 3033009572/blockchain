import UTXOPool from './UTXOPool.js'

Blockchain
class Blockchain {
  // 构造函数
  constructor(name, genesisBlock) {
    this.name = name // 区块链名称
    this.genesisBlock = genesisBlock // 创世区块
    this.blocks = new Map() // 存储区块的映射
    this.utxoPool = new UTXOPool() // UTXO池对象
    this.addBlock(genesisBlock)
  }

  // 返回当前链中最长的区块信息列表
  longestChain() {
    let maxLength = 0
    let maxBlock = null
    
    const traverse = (block, length = 1) => {
      if (!block) return
      
      if (length > maxLength) {
        maxLength = length
        maxBlock = block
      }
      
      for (const hash of block.getPrevBlockHashes()) {
        traverse(this.blocks.get(hash), length + 1)
      }
    }

    traverse(this.genesisBlock)

    const chain = []
    let block = maxBlock
    while (block) {
      chain.push(block)
      const prevHash = block.getPrevBlockHashes()[0]
      block = prevHash ? this.blocks.get(prevHash) : null
    }
    
    return chain.reverse()
  }

  // 判断当前区块链是否包含指定的区块
  containsBlock(block) {
    const existingBlock = this.blocks.get(block.getHash())
    return existingBlock && existingBlock.equals(block)
  }

  // 获得区块高度最高的区块
  maxHeightBlock() {
    let maxHeight = -1
    let maxHeightBlock = null
    for (const [, block] of this.blocks) {
      const height = block.getHeight()
      if (height > maxHeight) {
        maxHeight = height
        maxHeightBlock = block
      }
    }
    return maxHeightBlock
  }

  // 添加区块
  /*

  */
  _addBlock(block) {
    if (!block.isValid()) return
    if (this.containsBlock(block)) return
    
    const txs = block.getTransactions()
    const txInputs = txs.flatMap((tx) => tx.inputs)
    const txOutputs = txs.flatMap((tx) => tx.outputs)

    // 对UTXO池进行快照，获取当前UTXO状态
    const utxoPoolSnapshot = new UTXOPool(this.utxoPool)

    // 先把所有input对应的UTXO从UTXO池中删除
    txInputs.forEach(({ prevTxHash, outputIndex }) => this.utxoPool.removeUTXO(prevTxHash, outputIndex))

    // 再添加所有output中的UTXO到UTXO池中
    txOutputs.forEach((output, index) => {
      this.utxoPool.addUTXO(new UTXO(block.getHash(), index), output)
    })

    // 添加区块
    this.blocks.set(block.getHash(), block)
  }

}

export default Blockchain
