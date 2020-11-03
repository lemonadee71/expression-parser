let operatorList = {
  '(': {
    type: 'bracket',
    text: 'bracket',
    precedence: 1
  },
  ')': {
    type: 'bracket',
    text: 'bracket',
    precedence: 1
  },
  '+': {
    type: 'operator',
    text: 'add',
    precedence: 2
  },
  '-': {
    type: 'operator',
    text: 'subtract',
    precedence: 2
  },
  've': {
    type: 'operator',
    text: 'negative',
    precedence: 3
  },
  '*': {
    type: 'operator',
    text: 'multiply',
    precedence: 4
  },
  '/': {
    type: 'operator',
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
  },
  '√': {
    type: 'function',
    text: 'sqrt',
    precedence: 5
  },
}

let test = '2+1+4/2' || '-cos(10)*3+(5+2)^2' || '6+(-3*2)-(9-3)/3' || '((4*3)^2)/2' || '4*(3-2)+5' || '4^3^2*5',
  tree = null
  currentNode = new Node('(')

function Node(x) {
  this.node = x
  this.parent = null
  this.leftChild = null
  this.rightChild = null
  this.text = isNaN(this.node) ? operatorList[x].text : 'constant'
  this.type = isNaN(this.node) ? operatorList[x].type : 'constant'
  this.precedence = isNaN(this.node) ? operatorList[x].precedence : 7
}

const compute = (node) => {
  if (node.type === 'function' || node.type === 'operator')
    return calculator(node.text, node.leftChild, node.rightChild)
  return parseFloat(node.node)
}

const calculator = (type, x, y) => {
  x = x ? compute(x) : null
  y = y ? compute(y) : null

  switch(type) {
    case 'add':
      return x + y;
    case 'subtract':
      return x - y;
    case 'multiply':
      return x * y;
    case 'divide':
      return x / y;
    case 'exponent':
      return x ** y; 
    case 'factorial':
      return factorial(x || y)
    case 'negative':
      return -1 * (x || y)
    case 'sin':
      return Math.sin(x || y)
    case 'cos':
      return Math.cos(x || y)
    case 'tan':
      return Math.tan(x || y)
    case 'sqrt':
      return Math.sqrt(x || y)
  }
}

const factorial = (n) => {
  if (n === 1) return 1
  return n * factorial(n - 1)
}

const parse = (expr) => {
  try {
    let nodes = [],
     prev = null

    while(expr) {
      let match = expr.match(/^[\d.]+/) || expr.match(/^[a-z]+/)
      
      if (match) {
        if (isNaN(match[0])) {
          if (match[0].includes('.'))
            throw 'MathError. Decimal point is more than 1.'

          nodes.push(new Node(match[0]))
          expr = expr.replace(/^[a-z]+/, '')
        } else {         
          nodes.push(new Node(match[0]))
          expr = expr.replace(/^[\d.]+/, '')
        }

        prev = match[0]
      } else {
        let operator = expr.charAt(0)

        if (operator === '-' && !'()'.includes(prev) && isNaN(prev)) {
          nodes.push(new Node('ve'))
        } else {
          nodes.push(new Node(operator))
        }      

        expr = expr.replace(operator, '')
        prev = operator
      }
    }   

    //nodes.forEach(node => insertToTree(currentNode, node))
    //tree = getRoot(currentNode).rightChild
    //tree.parent = null
    //console.log(tree)
    //console.log(compute(tree))
    createTree(nodes)
  } catch(error) {
    console.log(error)
  }
  
}

const createTree = (nodes) => {
  let expressionTree = nodes.reduce((tree, node) => {
    console.log(tree, node)
    return insertToTree(tree, node)
  }, new Node('('))
 
  //expressionTree = getRoot(tree).rightChild
  //expressionTree.parent = null
  
  console.log(expressionTree)
  //console.log(compute(expressionTree))  
}

const insertToTree = (currentNode, newNode) => {
  let condition = newNode.node === '^' || newNode.node === '√'
                ? newNode.precedence < currentNode.precedence 
                : newNode.precedence <= currentNode.precedence

  if (newNode.node === ')') {
    currentNode = deleteNode(currentNode)
    return currentNode
  }

  if (newNode.text !== 'negative' && newNode.type !== 'bracket' && condition) {   
    insertToTree(currentNode.parent, newNode)
  } else {
    newNode.leftChild = currentNode.rightChild
    currentNode.rightChild = newNode
    newNode.parent = currentNode
    
    if (newNode.leftChild) {
      newNode.leftChild.parent = newNode
    }

    currentNode = newNode
  }

  return currentNode
}

const deleteNode = (currentNode) => {
  let openingParen = climbTree(currentNode)
  openingParen.rightChild.parent = openingParen.parent
  openingParen.parent.rightChild = openingParen.rightChild
  return openingParen.parent
  //currentNode = openingParen.parent
}

const climbTree = (currentNode) => {
  if (currentNode.parent.type !== 'bracket') {
    return climbTree(currentNode.parent)
  }
  return currentNode.parent
}

const getRoot = (node) => {
  if (node.parent) {
    return getRoot(node.parent)
  }
  return node
}

document.addEventListener('load', parse(test))