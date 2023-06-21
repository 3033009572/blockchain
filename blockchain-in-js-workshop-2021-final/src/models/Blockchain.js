import UTXOPool from './UTXOPool.js'

class Blockchain {
  // 1. 完成构造函数及其参数
  /* 构造函数需要包含
      - 名字
      - 创世区块
      - 存储区块的映射
  */
      constructor(name, genesisBlock) {
        this.name = name
        this.blockchain = new Map()
        this.utxoPool = new UTXOPool()
        this.addBlock(genesisBlock)
      }

  // 2. 定义 longestChain 函数
  /*
    返回当前链中最长的区块信息列表
  */
    longestChain() {
      let longestChain = []
      for (let [hash, block] of this.blockchain) {
        let candidateChain = [block]
        let preHash = block.previousHash
        while (preHash) {
          let preBlock = this.blockchain.get(preHash)
          if (!preBlock) break
          candidateChain.unshift(preBlock)
          preHash = preBlock.previousHash
        }
    
        if (candidateChain.length > longestChain.length) {
          longestChain = candidateChain
        }
      }
      return longestChain
    }
  // 判断当前区块链是否包含
  containsBlock(block) {
    // 添加判断方法
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

  // 添加区块
  /*

  */
  _addBlock(block) {
    if (!block.isValid()) return
    if (this.containsBlock(block)) return
  
    this.blockchain.set(block.hash, block)
  
    const changedUTXOs = block.transactions.reduce((utxos, tx) => {
      return utxos.concat(tx.apply())
    }, [])
    changedUTXOs.forEach(utxo => this.utxoPool.addUTXO(utxo))
  }
}

export default Blockchain
