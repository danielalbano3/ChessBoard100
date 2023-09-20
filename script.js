const board = document.querySelector('#board')

const cells = []
let pieces = []
let turnCount = 1
let turn = 'top' 

class Cell{
  constructor(row,col){
    this.row = row
    this.col = col
    this.owner = null
    this.signal = null
    this.square = this.add()
    cells.push(this)
  }

  add(){
    const div = document.createElement('div')
    div.classList.add('cell')
    board.appendChild(div)
    return div
  }
}

for (let r = 1; r <= 8; r++){
  for (let c = 1; c <= 8; c++){
    const cell = new Cell(r,c)
    if (r % 2 == 0){
      cell.color = c % 2 == 0 ? 'orange' : 'brown'
    } else {
      cell.color = c % 2 == 0 ? 'brown' : 'orange'
    }
    cell.square.classList.add(cell.color)
  }
}

function getCell(row,col){
  return cells.find(cell => cell.row === row && cell.col === col)
}

class Piece{
  constructor(row,col,side){
    this.row = row
    this.col = col
    this.side = side
  }

  enter(cell){
    const oldCell = cells.find(c => c.owner === this)
    if (oldCell != null) oldCell.owner = null
    cell.owner = this
    this.row = cell.row
    this.col = cell.col
  }
}

class Pawn extends Piece{
  constructor(row,col,side){
    super(row,col,side)
    this.kind = 'pawn'
    this.jumptime = null
    this.direction = side === 'top' ? 1 : -1
    this.commandSize = 6
    this.moves = this.getSpaces()
    this.enter(getCell(this.row,this.col))
    pieces.push(this)
  }

  getSpaces(){
    return {
      forward: getCell(this.row + this.direction,this.col),
      jump: getCell(this.row + this.direction * 2,this.col),
      left: getCell(this.row,this.col - 1),
      right: getCell(this.row,this.col + 1),
      leftatk: getCell(this.row + this.direction,this.col - 1),
      rightatk: getCell(this.row + this.direction,this.col + 1)
    }
  }

  showSpaces(){
    const move = this.moves
    const forward = move.forward
    const jump = move.jump
    const leftatk = move.leftatk
    const rightatk = move.rightatk
    const left = move.left
    const right = move.right
    cells.forEach(c => c.signal = null)
    //forward
    if (forward != null && forward.owner === null) forward.signal = 'forward'
    //jump
    if (jump != null && jump.owner === null && forward.owner === null && this.jumptime === null) jump.signal = 'jump'
    //leftatk
    if (leftatk != null && leftatk.owner != null){
      if (leftatk.owner.kind === 'pawn' && leftatk.owner.side != turn) leftatk.signal = 'leftatk'
    }
    //rightatk
    if (rightatk != null && rightatk.owner != null){
      if (rightatk.owner.kind === 'pawn' && rightatk.owner.side != turn) rightatk.signal = 'rightatk'
    }
    //leftatk enpassant
    if (leftatk != null && leftatk.owner == null){
      if (left.owner != null){
        if (left.owner.kind === 'pawn' && left.owner.side != turn) leftatk.signal = 'leftatk ep'
      }
    }
    //rightatk enpassant
    if (rightatk != null && rightatk.owner == null){
      if (right.owner != null){
        if (right.owner.kind === 'pawn' && right.owner.side != turn) rightatk.signal = 'rightatk ep'
      }
    }
  }

  commands(choice){
    this.showSpaces()
    switch(choice){
      case 0://forward
        const forward = cells.find(c => c.signal === 'forward')
        if (forward != null) this.enter(forward)
        console.log('forwarded')
        break
      case 1://jump
        const jump = cells.find(c => c.signal === 'jump')
        if (jump != null) {
          this.enter(jump)
          this.jumptime = turnCount
        }
        console.log('jumped')
        break
      case 2://leftatk
        const leftatk = cells.find(c => c.signal === 'leftatk')
        if (leftatk != null){
          leftatk.owner = null
          this.enter(leftatk)
        }
        console.log('leftatk')
        break
      case 3://rightatk
        const rightatk = cells.find(c => c.signal === 'rightatk')
        if (rightatk != null){
          rightatk.owner = null
          this.enter(rightatk)
        }
        console.log('rightatk')
        break
      case 4://leftenpassant
        const leftep = cells.find(c => c.signal === 'leftatk ep')
        const left = this.moves.left
        if (leftep != null){
          left.owner = null
          this.enter(leftep)
        }
        console.log('enpass left')
        break
      case 5://rightenpassant
        const rightep = cells.find(c => c.signal === 'rightatk ep')
        const right = this.moves.right
        if (rightep != null){
          right.owner = null
          this.enter(rightep)
        }
        console.log('enpass right')
        break
      default:
        return
    }
    // cells.forEach(c => c.signal = null)
  }
}

const p1 = new Pawn(2,1,'top')
const p2 = new Pawn(2,2,'bottom')

p1.commands(5)
console.log(cells)

class AIPlayer{
  constructor(side){
    this.side = side
    this.piece = null
  }

  randomPick(max){
    return Math.floor(Math.random() * max)
  }

  selectPiece(){
    const choices = pieces.filter(piece => piece.side === this.side)
    const number = this.randomPick(choices.length)
    this.piece = choices[number]
    console.log(this.piece)
  }

  selectCommand(){
    const commandWeight = this.piece.commandSize
    const randomCommand = this.randomPick(commandWeight)
    this.piece.commands(randomCommand)
  }
}

const bob = new AIPlayer('top')
bob.selectPiece()
bob.selectCommand()