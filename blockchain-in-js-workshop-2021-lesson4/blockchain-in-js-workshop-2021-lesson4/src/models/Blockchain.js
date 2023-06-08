import UTXOPool from './UTXOPool.js'

class Blockchain {
  constructor(genesisBlock) {
    this.blocks = new Map()
    this.blocks.set(genesisBlock.calculateHash(), genesisBlock)
  }

  // 获取当前区块链上所有分支链中，长度最长的区块信息列表
  longestChain() {
    let chain = []
    for (let blockHash of this.blocks.keys()) {
      let currentBlock = this.blocks.get(blockHash)
      let tempChain = []
      while (currentBlock) {
        tempChain.push(currentBlock)
        currentBlock = this.blocks.get(currentBlock.previousBlockHash)
      }
      if (tempChain.length > chain.length) {
        chain = tempChain
      }
    }
    return chain
  }

  // 判断当前区块链上是否包含指定的区块
  containsBlock(block) {
    const blockHash = block.calculateHash()
    return this.blocks.has(blockHash)
  }

  // 获取当前区块链上高度最高的区块
  maxHeightBlock() {
    let maxHeightBlock = null
    for (let blockHash of this.blocks.keys()) {
      let currentBlock = this.blocks.get(blockHash)
      while (currentBlock) {
        if (!maxHeightBlock || currentBlock.height > maxHeightBlock.height) {
          maxHeightBlock = currentBlock
        }
        currentBlock = this.blocks.get(currentBlock.previousBlockHash)
      }
    }
    return maxHeightBlock
  }

  // 添加新的块到当前区块链中，并更新 UTXO 池的快照
  _addBlock(block, utxoPool) {
    if (!block.isValid()) return
    if (this.containsBlock(block)) return

    const parentBlock = this.blocks.get(block.previousBlockHash)
    if (!parentBlock) return

    // 计算新区块的高度
    block.height = parentBlock.height + 1

    // 创建 UTXO 池快照
    const utxoSnapshot = new UTXOPool(utxoPool.getAllUTXO())

    // 检查区块中的所有交易是否有效
    const txs = block.transactions
    const txInputUTXOSet = new Set()
    for (let i = 0; i < txs.length; i++) {
      const tx = txs[i]
      if (!tx.isValid()) return

      // 检查交易输入是否能在 UTXO 池中找到对应的 UTXO
      const txInputs = tx.inputs
      for (let j = 0; j < txInputs.length; j++) {
        const input = txInputs[j]
        const utxo = new UTXO(input.prevTxHash, input.outputIndex)
        if (txInputUTXOSet.has(utxo)) return
        txInputUTXOSet.add(utxo)
        if (!utxoSnapshot.contains(utxo) || !utxoSnapshot.getUTXO(utxo).address.equals(input.address)) {
          return
        }
      }

      // 更新 UTXO 池快照
      const txOutputs = tx.outputs
      for (let k = 0; k < txOutputs.length; k++) {
        const output = txOutputs[k]
        const utxo = new UTXO(tx.calculateHash(), k)
        utxoSnapshot.addUTXO(utxo, output)
      }
    }

    // 检查 UTXO 池快照是否有效
    if (!utxoSnapshot.isValid()) return

    // 添加新区块到区块链中
    this.blocks.set(block.calculateHash(), block)
  }
}

export default Blockchain