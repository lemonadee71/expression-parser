let test = '4*(3-2)+5'

let types = {
  function: {
    add
  },
  operator: {
    '+': 2,
    '-': 2,
    '-ve': 3,
    '*': 4,
    '/': 4,
    '^': 5,
    '!': 6,
    '(': 7,
  }
}

const findType = (node) => {
  for (let type in types) {
    if (node in types[type]) {
      return type
    }
  }

  return 'number'
}

function Node(_node) {
  this.node = _node;
  this.type = findType(node)
  this.precedence = (this.type === 'function' || this.type === 'number') ? 8 : types[this.type][this.node]
  this.parent = null
  this.leftChild = null
  this.rightChild = null
}