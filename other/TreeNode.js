class TrieNode {
    constructor() {
      this.children = new Map(); // 子节点
      this.isEnd = false; // 是否是字符串结尾
    }
  
    // 添加一个字符串到字典树
    insert(word) {
      let node = this;
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        if (!node.children.has(char)) {
          node.children.set(char, new TrieNode());
        }
        node = node.children.get(char);
      }
      node.isEnd = true;
    }
  
    // 从字典树中删除一个字符串
    remove(word, node = this, depth = 0) {
      if (!node) {
        return false;
      }
  
      if (depth === word.length) {
        if (!node.isEnd) {
          return false;
        }
        node.isEnd = false;
        return node.children.size === 0;
      }
  
      const char = word[depth];
      const isDeleted = this.remove(word, node.children.get(char), depth + 1);
  
      if (isDeleted && !node.isEnd) {
        node.children.delete(char);
        return node.children.size === 0;
      }
  
      return false;
    }
  }