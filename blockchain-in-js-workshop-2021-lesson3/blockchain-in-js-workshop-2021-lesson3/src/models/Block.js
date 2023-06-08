import sha256 from 'crypto-js/sha256.js'

export const DIFFICULTY = 2

class Block {
  // 构造函数需要包含 - 时间戳 - 上一个区块的哈希值 - 当前区块的哈希值 - 区块高度 - 交易信息 - 难度值（默认值为 DIFFICULTY）
  constructor(timestamp, previousHash, hash, height = 0, data = [], difficulty = DIFFICULTY) {
    this.timestamp = timestamp;
    this.previousHash = previousHash;
    this.hash = hash;
    this.height = height;
    this.data = data;
    this.difficulty = difficulty;
    this.nonce = 0;
  }

  // 验证区块是否正确
  isValid() {
    // 验证当前区块的哈希值是否正确
    let currentHash = this.calculateHash();
    if (this.hash !== currentHash) {
      return false;
    }

    // 验证当前区块的难度值是否正确
    let prefix = '0'.repeat(this.difficulty);
    if (this.hash.substring(0, this.difficulty) !== prefix) {
      return false;
    }

    // 验证上一个区块的哈希值是否等于当前区块中记录的上一个区块哈希值
    let previousBlock = this.previousBlock();
    if (previousBlock && previousBlock.hash !== this.previousHash) {
      return false;
    }

    return true;
  }

  // 设置随机值
  setNonce(nonce) {
    this.nonce = nonce;
    this.hash = this.calculateHash();
  }

  // 计算区块的哈希值
  calculateHash() {
    return sha256(this.timestamp + this.previousHash + JSON.stringify(this.data) + this.height + this.nonce).toString();
  }

  // 获取上一个区块
  previousBlock() {
    if (this.height > 0) {
      return blockchain[this.height - 1];
    }
    return null;
  }
}

export default Block;