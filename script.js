const board = document.querySelector('#board')

let turnCount = 1
let turn = 'black' 
const cells = []

class Cell{
  constructor(row,col){
    this.row = row
    this.col = col
    cells.push(this)
    
    const div = document.createElement('div')
    div.classList.add('cell')
    board.appendChild(div)
    this.div = div
    
    this.owner = this.div.firstChild
  }

}

let cellColor = null
for (let r = 1; r <= 8; r++){
  for (let c = 1; c <= 8; c++){
    const cell = new Cell(r,c)
    if (r % 2 == 0){
      cellColor = c % 2 == 0 ? 'orange' : 'tan'
    } else {
      cellColor = c % 2 == 0 ? 'tan' : 'orange'
    }
    cell.div.classList.add(cellColor)
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
}

class Pawn extends Piece{
  constructor(row,col,side){
    super(row,col,side)
    this.kind = 'pawn'
    this.jumptime = null
    this.direction = side === 'top' ? 1 : -1
    this.spaces = {
      forward:    getCell(this.row + this.direction,this.col),       
      jump:       getCell(this.row + this.direction * 2,this.col),  
      leftAtk:    getCell(this.row + this.direction,this.col - 1),   
      rightAtk:   getCell(this.row + this.direction,this.col + 1),

      leftSide:   getCell(this.row,this.col - 1),                    
      rightSide:  getCell(this.row,this.col + 1),                    
    }
    // this.moves = this.testMoves()
    this.cell = getCell(this.row,this.col)
    const cell = this.cell
    cell.owner = this
    // this.piece = this.addHtml()

    
    const div = document.createElement('div')
    div.classList.add('piece','pawn',this.side)
    const space = cell.div
    space.appendChild(div)
    this.piece = div
    
  }

  // addHtml(){
  //   const div = document.createElement('div')
  //   div.classList.add('piece')
  //   div.classList.add('pawn')
  //   div.classList.add(this.side)
  //   const cell = this.cell
  //   const space = cell.div
  //   space.appendChild(div)
  //   return div
  // }

  // getSpaces(){
  //   return {
  //     forward:    getCell(this.row + this.direction,this.col),       
  //     jump:       getCell(this.row + this.direction * 2,this.col),  
  //     leftAtk:    getCell(this.row + this.direction,this.col - 1),   
  //     rightAtk:   getCell(this.row + this.direction,this.col + 1),

  //     leftSide:   getCell(this.row,this.col - 1),                    
  //     rightSide:  getCell(this.row,this.col + 1),                    
  //   }
  // }

  // moveForward(){
  //   const space = this.spaces
  //   const forwardCell = space.forward
  //   if (forwardCell == null || forwardCell.owner != null) return null
  // }

  // testMoves(){
  //   const validMoves = []
  //   const moves = [this.moveForward]
  //   moves.forEach(move => {
  //     if (move() == null) validMoves.push(move)
  //   })
  //   return validMoves
  // }
}

class AIPlayer{
  constructor(side){
    this.side = side
    this.piece = null
  }

  randomPick(max){
    return Math.floor(Math.random() * max)
  }

  selectPiece(){
    return
  }

  selectCommand(){
    return
  }
}

// function abc(){if (false) return 5;console.log('yes');}
// function def(){return null}

// const ghi = [abc,def]
// const jkl = []
// ghi.forEach(fn => {if (fn() == null) jkl.push(fn)})
// console.log(jkl)

const p1 = new Pawn(1,1,'top')