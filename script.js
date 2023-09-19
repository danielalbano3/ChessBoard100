const cells = []
let topPieces = []
let bottomPieces = []
let turnCount = 1
let turn = 'bottom' 

class Cell{
  constructor(row,col){
    this.row = row
    this.col = col
    this.owner = null
    this.signal = null
    cells.push(this)
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
    this.moves = this.getSpaces()
    side === 'top' ? topPieces.push(this) : bottomPieces.push(this)
    this.enter(getCell(this.row,this.col))
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
    cells.forEach(c => c.signal = null)
    //forward
    if (forward != null && forward.owner === null) forward.signal = 'forward'
    //jump
    if (jump != null && jump.owner === null && forward.owner === null && this.jumptime === null) jump.signal = 'jump'
    //leftatk

    //rightatk
  }

  commands(choice){
    switch(choice){
      case 0://forward
        break
      case 1://jump
        this.jumptime = turnCount
        break
      case 2://leftatk
        break
      case 3://rightatk
        break
      default:
        return
    }
  }
}

const p1 = new Pawn(2,1,'top')
const p2 = new Pawn(3,2,'bottom')

p2.showSpaces()
p1.showSpaces()
console.log(cells)