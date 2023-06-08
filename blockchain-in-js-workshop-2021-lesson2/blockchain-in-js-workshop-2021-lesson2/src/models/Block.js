import sha256 from 'crypto-js/sha256.js'

export const DIFFICULTY = 3

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return sha256(
      this.index +
      this.previousHash +
      this.timestamp +
      JSON.stringify(this.data) +
      this.nonce).toString();
  }

  isValid() {
    return this.hash.substring(0, DIFFICULTY) === '0'.repeat(DIFFICULTY)
  }

  setNonce(nonce) {
    this.nonce = nonce;
    this.hash = this.calculateHash();
  }

  updateHash() {
    this.hash = this.calculateHash();
  }
}

export default Block;

