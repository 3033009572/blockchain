import _ from 'lodash'
import Block from '../models/Block.js'

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()]
  }

  createGenesisBlock() {
    return new Block(0, 'This is the genesis block!', '0')
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1]
  }

  getNextBlock(previousBlock, data) {
    const newBlockIndex = previousBlock.getIndex() + 1
    const previousBlockHash = previousBlock.getHash()
    return new Block(newBlockIndex, data, previousBlockHash)
  }

  addBlock(newBlock) {
    if (this.isValidNewBlock(newBlock, this.getLatestBlock())) {
      this.chain.push(newBlock)
    }
  }

  isValidNewBlock(newBlock, previousBlock) {
    if (previousBlock.getIndex() + 1 !== newBlock.getIndex()) {
      console.log('Invalid index')
      return false
    } else if (previousBlock.getHash() !== newBlock.previousHash) {
      console.log('Invalid previous hash')
      return false
    } else if (newBlock.calculateHash() !== newBlock.hash) {
      console.log(typeof newBlock.hash + ' ' + typeof newBlock.calculateHash())
      console.log('Invalid hash: ' + newBlock.calculateHash() + ' ' + newBlock.hash)
      return false
    }
    return true
  }

 longestChain() {
  
  let chain = []
  let currentHash = this.genesis.hash

  while (currentHash) {
    let currentBlock = this.blocks[currentHash]
    if(!currentBlock) {
      break;
    }
    chain.push(currentBlock)
    currentHash = currentBlock.nextHash
  }

  return chain
}
}

export default Blockchain