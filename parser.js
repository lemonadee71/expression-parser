let operators = {
  '(': {
    type: 'parenthesis',
    text: 'parenthesis',
    precedence: 1
  },
  '+': {
    type: 'function',
    text: 'add',
    precedence: 2
  },
  '-': {
    type: 'function',
    text: 'subtract',
    precedence: 2
  },
  've': {
    type: 'function',
    text: 'negative',
    precedence: 3
  },
  '*': {
    type: 'function',
    text: 'multiply',
    precedence: 4
  },
  '/': {
    type: 'function',
    text: 'divide',
    precedence: 4
  },
  '^': {
    type: 'function',
    text: 'exponent',
    precedence: 5
  },
  '!': {
    type: 'function',
    text: 'factorial',
    precedence: 6
  },
}

let test =  '5-6/2+3*4' || '4^3^2*5',
  currentNode = new Node('('), 
  tree 

function Node(x) {
  this.node = x
  this.type = isNaN(this.node) ? operators[x].type : 'number'
  this.precedence = isNaN(this.node) ? operators[x].precedence : 7
  this.parent = null
  this.leftChild = null
  this.rightChild = null
}

const compute = (expr) => {
  let nodes = expr.split('').map(char => new Node(char))
  nodes.forEach(node => traverseTree(currentNode, node))
  tree = parseTree(currentNode).rightChild
  console.log(tree)
}

const traverseTree = (current, newNode) => {
  let condition = newNode.node === '^' 
                ? newNode.precedence < current.precedence 
                : newNode.precedence <= current.precedence

  if (condition) {   
    traverseTree(current.parent, newNode)
  } else {
    newNode.leftChild = current.rightChild
    current.rightChild = newNode
    newNode.parent = current
    
    if (newNode.leftChild) {
      newNode.leftChild.parent = newNode
    }

    currentNode = newNode
  }
}

const parseTree = (node) => {
  if (node.parent) {
    return parseTree(node.parent)
  }
  return node
}

document.addEventListener('load', compute(test))