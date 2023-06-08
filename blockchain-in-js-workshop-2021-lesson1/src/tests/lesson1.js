import Block from '../models/Block.js'
import Blockchain from '../models/Blockchain.js'
import sha256 from 'crypto-js/sha256.js'

// 创建初始块
const genesisBlock = new Block(0, 'This is the genesis block!', '0')
// 创建一个新的区块链
const blockchain = new Blockchain('BitCoin')
// 将初始块添加到区块链
blockchain.addBlock(genesisBlock)
// 使用区块链中最后一个块的哈希创建一个新块
const previousBlock = blockchain.getLatestBlock()
// 创建新块
const newBlock = new Block(previousBlock.getIndex() + 1, 'This is a new block!', previousBlock.getHash())
// 查找下一个新块
const nextBlock = blockchain.getNextBlock(previousBlock, 'This is another block!')
// 比较新块
const result = compareBlocks(newBlock, nextBlock)
const longestChain = [genesisBlock]

function compareBlocks(block1, block2) {
  if (block1.getIndex() !== block2.getIndex() || block1.getHash() !== block2.getHash()) {
    console.log('Blocks do not match:\n', block1, '\n', block2)
    return false
  }
  return true
}
// 验证新块是否应添加到最长链
if (longestChain.length === 1 || (isValidBlock(newBlock, previousBlock) && isValidChain(longestChain))) {
  longestChain.push(newBlock)
  console.log('Block added to the longest chain:', newBlock)
} else {
  console.log('Block rejected by the longest chain:', newBlock)
  console.log('The longest chain:', longestChain)
}
console.log(blockchain)
console.log(longestChain)
console.log(newBlock)
console.log(nextBlock)
const main = () => {
  // 初始化区块链
  var blockchain = new Blockchain('BitCoin')

  // 创建创世区块
  var genesisBlock = new Block(blockchain, 'root', 0, 'root')
  genesisBlock.isGenesis = true

  // 设置创世区块
  blockchain.genesis = genesisBlock

  // 构建区块
  var newBlock = new Block(
    blockchain,
    genesisBlock.hash,
    1,
    sha256(new Date().getTime().toString()).toString(),
  )
  genesisBlock.nextHash = newBlock.hash

  blockchain.blocks[newBlock.hash] = newBlock

  var nextBlock = new Block(
    blockchain,
    newBlock.hash,
    2,
    sha256(new Date().getTime().toString()).toString(),
  )
  newBlock.nextHash = nextBlock.hash

  var nextCompetitionBlock = new Block(
    blockchain,
    newBlock.hash,
    2,
    sha256((new Date().getTime() + 1).toString()).toString(),
  )
  nextBlock.nextHash = nextCompetitionBlock.hash

  // 添加两个区块高度为 2 的竞争区块
  blockchain.blocks[nextBlock.hash] = nextBlock
  blockchain.blocks[nextCompetitionBlock.hash] = nextCompetitionBlock

  let longestChain = blockchain.longestChain()

  console.assert(longestChain.length >= 2, 'Block height should be 2')

  var thirdBlock = new Block(
    blockchain,
    nextCompetitionBlock.hash,
    3,
    sha256(new Date().getTime().toString()).toString(),
  )
  nextBlock.nextHash = thirdBlock.hash

  blockchain.blocks[thirdBlock.hash] = thirdBlock

  longestChain = blockchain.longestChain()

  // 区块检查
  console.assert(longestChain.length >= 3, 'Block height should be 3')

  if (longestChain.length >= 3) {
    console.assert(longestChain[2].hash == nextBlock.hash, `Height block hash should be ${nextBlock.hash}`)
  }
  }
  // 验证新块是否应添加到最长链
if (longestChain.length === 1 || (isValidBlock(newBlock, previousBlock) && isValidChain(longestChain))) {
  longestChain.push(newBlock)
  console.log('Block added to the longest chain:', newBlock)
} else {
  console.log('Block rejected by the longest chain:', newBlock)
  console.log('The longest chain:', longestChain)
}
console.log(blockchain)
console.log(longestChain)
console.log(newBlock)
console.log(nextBlock)
  
main()