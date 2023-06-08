class Blockchain {
  // 构造函数需要包含 - 名字 - 创世区块 - 存储区块的映射
  constructor(name, genesisBlock) {
    this.name = name; // 名字
    this.blocks = {}; // 存储区块的映射
    this.blocks[0] = genesisBlock; // 创世区块
  }

  // 返回当前链中最长的区块信息列表
  longestChain() {
    let longestLength = 1; // 当前最长链长度
    let longestChain = [this.blocks[0]]; // 当前最长链

    for (let key in this.blocks) {
      let currentBlock = this.blocks[key];
      let previousBlock = this.blocks[currentBlock.previousHash];

      if (previousBlock && currentBlock.index > 0) {
        // 根据前一个区块的信息来计算当前区块的哈希值，以此判断是否链是正确的
        let currentHash = currentBlock.calculateHash();
        if (currentHash === currentBlock.hash) {
          // 计算当前区块的链长度
          let length = 1;
          let current = currentBlock;
          while (current.previousHash !== null) {
            current = this.blocks[current.previousHash];
            length++;
          }

          // 如果当前链的长度比已知的最长链长度长，则替换最长链
          if (length > longestLength) {
            longestLength = length;
            longestChain = [];

            let current = currentBlock;
            while (current.previousHash !== null) {
              longestChain.unshift(current);
              current = this.blocks[current.previousHash];
            }
            longestChain.unshift(current);
          }
        }
      }
    }

    return longestChain;
  }

  // 添加区块
  addBlock(block) {
    let previousBlock = this.blocks[block.previousHash];
    if (previousBlock) {
      // 根据前一个区块的信息来计算当前区块的哈希值，以此判断是否链是正确的
      let currentHash = block.calculateHash();
      if (currentHash === block.hash) {
        this.blocks[block.hash] = block;
        return true;
      }
    }
    return false;
  }
}

export default Blockchain;