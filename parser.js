let operators = {
  '(': {
    type: 'parenthesis',
    text: 'parenthesis',
    precedence: 1
  },
  ')': {
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

let test =  '((4*3)^2)/2' || '4*(3-2)+5' || '5-6/(2+3*4)' || '4^3^2*5',
  currentNode = new Node('('), 
  tree = null

function Node(x) {
  this.node = x
  this.text = isNaN(this.node) ? operators[x].text : 'number'
  this.type = isNaN(this.node) ? operators[x].type : 'number'
  this.precedence = isNaN(this.node) ? operators[x].precedence : 7
  this.parent = null
  this.leftChild = null
  this.rightChild = null
}

const compute = (expr) => {
  let nodes = expr.split('').map(char => new Node(char))
  nodes.forEach(node => insertToTree(currentNode, node))
  tree = getRoot(currentNode).rightChild
  console.log(tree)
}

const insertToTree = (current, newNode) => {
  let condition = newNode.node === '^' 
                ? newNode.precedence < current.precedence 
                : newNode.precedence <= current.precedence

  if (newNode.node === ')') {
    deleteNode(current)
    return;
  }

  if (newNode.type !== 'parenthesis' && condition) {   
    insertToTree(current.parent, newNode)
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

const deleteNode = (current) => {
  let openingParen = climbTree(current)
  openingParen.rightChild.parent = openingParen.parent
  openingParen.parent.rightChild = openingParen.rightChild
  currentNode = openingParen.parent
}

const climbTree = (current) => {
  if (current.parent.type !== 'parenthesis') {
    return climbTree(current.parent)
  }
  return current.parent
}

const getRoot = (node) => {
  if (node.parent) {
    return getRoot(node.parent)
  }
  return node
}

document.addEventListener('load', compute(test))