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
  'sin': {
    type: 'function',
    text: 'sin',
    precedence: 7
  },
  'cos': {
    type: 'function',
    text: 'cos',
    precedence: 7
  },
  'tan': {
    type: 'function',
    text: 'tan',
    precedence: 7
  }
}

let test =  'sin(50-2)^3!^-4!' || '6+(3*2)-(9-3)/3' || '((4*3)^2)/2' || '4*(3-2)+5' || '5-6/(2+3*4)' || '4^3^2*5',
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

const compute = (node) => {
  if (node.type === 'function') {
    // call function
    // functions take two parameters or one if not operator function
    // calculator(node.text, node.leftChild, node.rightChild)
    // function[node.text](compute(node.leftChild), compute(node.rightChild))
  } 

  return parseFloat(node.node)
}

const calculator = (type, x, y) => {
  switch(type) {
    case 'add':
      add(x, y)
      break;
    case 'subtract':
      subtract(x, y)
      break;
    case 'multiply':
      multiply(x, y)
      break; 
    case 'divide':
      divide(x, y)
      break;
    case 'exponent':
      exponent(x, y)
      break; 
    case 'factorial':
      factorial(x, y)
      break;  
  }
}

const parse = (expr) => {
  let nodes = []

  while(expr) {
    let match = expr.match(/^\d+/) || expr.match(/^[a-z]+/)
    
    if (match) {
      if (isNaN(match[0])) {
        nodes.push(new Node(match[0]))
        expr = expr.replace(/^[a-z]+/, '')
      } else {
        nodes.push(new Node(match[0]))
        expr = expr.replace(/^\d+/, '')
      }
    } else {
      let operator = expr.charAt(0)
      nodes.push(new Node(operator))
      expr = expr.replace(operator, '')
    }
  }

  nodes.forEach(node => insertToTree(currentNode, node))
  tree = getRoot(currentNode).rightChild
  tree.parent = null
  console.log(tree)
}

const insertToTree = (current, newNode) => {
  let condition = newNode.node === '^' 
                ? newNode.precedence < current.precedence 
                : newNode.precedence <= current.precedence

  if (current.type !== 'parenthesis' && current.type !== 'number' && newNode.text === 'subtract') {
    console.log(current.text, newNode.text) 
    newNode = new Node('ve')
  }

  if (newNode.node === ')') {
    deleteNode(current)
    return;
  }

  if (newNode.text !== 'negative' && newNode.type !== 'parenthesis' && condition) {   
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

document.addEventListener('load', parse(test))