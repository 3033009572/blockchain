import crypto from 'crypto'

class MerkleNode {
  constructor(data) {
    this.left = null
    this.right = null
    this.data = data
    this.hash = null
  }

  // 计算节点哈希
  computeHash() {
    if (!this.data) {
      return null
    }

    const hash = crypto.createHash('sha256')
    hash.update(this.data)
    return hash.digest()
  }

  // 递归计算Merkle树根节点的哈希
  static computeRoot(node) {
    if (!node) {
      return null
    }

    if (!node.hash) {
      node.hash = Buffer.concat([
        MerkleNode.computeRoot(node.left),
        MerkleNode.computeRoot(node.right)
      ])
    }

    return node.hash
  }

  // 递归生成Merkle树节点
  static buildTree(leaves) {
    if (!leaves || leaves.length === 0) {
      return null
    }

    if (leaves.length === 1) {
      return new MerkleNode(leaves[0])
    }

    const mid = Math.floor(leaves.length / 2)
    const left = MerkleNode.buildTree(leaves.slice(0, mid))
    const right = MerkleNode.buildTree(leaves.slice(mid))
    const parent = new MerkleNode(null)
    parent.left = left
    parent.right = right

    return parent
  }
}

class MerkleTree {
  constructor(data) {
    this.leaves = data.map(data => Buffer.from(data))
    this.root = MerkleNode.computeRoot(MerkleNode.buildTree(this.leaves))
  }

  toString() {
    return this.root.toString('hex')
  }

  verify(proof, element) {
    let idx = proof.index
    let hash = Buffer.from(element)
    const validatedHashes = [hash]

    for (let i = 0; i < proof.hashes.length; i++) {
      const siblingHash = proof.hashes[i]
      if (idx % 2 === 0) {
        hash = Buffer.concat([hash, siblingHash])
      } else {
        hash = Buffer.concat([siblingHash, hash])
      }
      idx = Math.floor(idx / 2)
      validatedHashes.push(hash)
    }

    return Buffer.compare(hash, proof.root) === 0
  }

  static createProof(tree, index) {
    const proof = { index, hashes: [] }

    let row = [new MerkleNode(tree.leaves[index])]
    for (let height = 0; row.length > 0; height++) {
      if (row.length > 1) {
        const curr = row.pop()
        const sibling = row.pop()

        proof.hashes.push(sibling.computeHash())
        if (index % 2 === 0) {
          row.push(curr)
          row.push(sibling)
        } else {
          row.push(sibling)
          row.push(curr)
        }

        index = Math.floor(index / 2)
      } else if (row.length === 1 && row[0].hash === null) {
        break
      } else {
        row.pop()
        index = Math.floor(index / 2)
      }
    }

    proof.root = this.computeRoot(row[0])
    return proof
  }
}

export default MerkleTree