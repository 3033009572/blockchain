import keccak from 'keccak256'

class MPTNode {
  constructor() {
    this.value = null // 节点存放的数据
    this.children = new Map() // 子节点
  }

  // 计算节点哈希
  computeHash() {
    const buffer = Buffer.from(JSON.stringify(this.children, Object.keys(this.children).sort()))
    return keccak(buffer)
  }
}

class MPT {
  constructor() {
    this.root = new MPTNode()
  }

  // 添加或更新一个地址
  put(address, balance) {
    let node = this.root
    for (let i = 2; i < address.length; i += 2) {
      const nibble = parseInt(address[i] + address[i + 1], 16)
      if (!node.children.has(nibble)) {
        node.children.set(nibble, new MPTNode())
      }
      node = node.children.get(nibble)
    }

    node.value = balance.toString()
  }

  // 查询一个地址的余额
  get(address) {
    let node = this.root
    for (let i = 2; i < address.length; i += 2) {
      const nibble = parseInt(address[i] + address[i + 1], 16)
      if (!node.children.has(nibble)) {
        return null
      }
      node = node.children.get(nibble)
    }

    return node.value ? parseInt(node.value) : null
  }

  // 删除一个地址
  del(address) {
    let stack = []
    let node = this.root
    for (let i = 2; i < address.length; i += 2) {
      const nibble = parseInt(address[i] + address[i + 1], 16)
      if (!node.children.has(nibble)) {
        return false
      }
      stack.push([nibble, node])
      node = node.children.get(nibble)
    }

    node.value = null

    while (stack.length > 0 && node.children.size === 0 && !node.value) {
      const [nibble, parent] = stack.pop()
      parent.children.delete(nibble)
      node = parent
    }

    return true
  }

  // 计算MPT Root Hash
  computeRootHash() {
    return this.root.computeHash()
  }

  // 验证一个地址的余额
  verify(address, balance) {
    const value = this.get(address)
    return value !== null && value === balance
    }
    }
    
    export default MPT