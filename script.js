const board = document.createElement("div")
const cells = []
let pieces = []
let turnCount = 1
let turn = 'white'
board.classList.add("board")
document.body.appendChild(board)

for (let r = 1; r <= 8; r++) {
  for (let c = 1; c <= 8; c++) {
    const space = document.createElement("div")
    space.classList.add("space")
    space.dataset.row = r
    space.dataset.col = c
    const cell = {
      row: r,
      col: c,
      div: space
    }
    if (c % 2 === 0) {
      space.classList.add(switchColor(r)[0])
    } else {
      space.classList.add(switchColor(r)[1])
    }
    board.appendChild(space)
    cells.push(cell)
  }
}
const spaces = document.querySelectorAll(".space")

function switchColor(number) {
  const colorpair = []
  if (number % 2 === 0) {
    colorpair[0] = "orange"
    colorpair[1] = "brown"
  } else {
    colorpair[1] = "orange"
    colorpair[0] = "brown"
  }
  return colorpair
}

function resetHighlight(){
  spaces.forEach(space => {
    space.classList.remove('.valid')
  })
}

function nextTurn(){
  turn = turn === 'white' ? 'black' : 'white'
}

class ChessPiece{
  constructor(row,col,color){
    this.row = row
    this.col = col
    this.color = color
  }

  moveTo(row,col){
    const cell = cells.find(cell => cell.row == row && cell.col == col)
    const space = cell.div
    if (cell == null) return
    if (this.isEmpty(cell)){
      space.appendChild(this.piece)
      this.row = row
      this.col = col
    } else {
      if (cell.owner.color !== turn){
        space.removeChild(cell.owner)
        pieces = pieces.filter(piece => piece.piece != cell.owner)
        space.appendChild(this.piece)
        this.row = row
        this.col = col
        getCell(this.row,this.col).owner = this.piece
      } else {
        return
      }
    }
  }
  isEmpty(cell){
    return cell.owner == null
  }
  render(){
    const piece = document.createElement('div')
    piece.dataset.piece = this.kind
    piece.dataset.color = this.color
    piece.classList.add('piece')
    return piece
  }
}

class Pawn extends ChessPiece {
  constructor(row,col,color){
    super(row,col,color)
    this.kind = "pawn"
    this.piece = this.render()
    this.moveTo(row,col)
    this.started = null
    pieces.push(this)
    getCell(this.row,this.col).owner = this.piece
  }
  pawnMoves(){
    const x = this.color === 'white' ? -1 : 1
    const moves = {
      forward: [1*x,0],
      jump: [2*x,0],
      leftatk: [1*x,-1],  //enpassant L
      rightatk: [1*x,1]   //enpassant R
    }
    return moves   
  }

  pawnAreas(){
    const moves = this.pawnMoves()
    const enPassantRow = this.color === 'white' ? 6 : 2
    const cells = {
      forward: cells.find(cell => cell.row == this.row + moves.forward[0] && cell.col == this.col + moves.forward[1]),
      jump: cells.find(cell => cell.row == this.row + moves.jump[0] && cell.col == this.col + moves.jump[1]),
      leftatk: cells.find(cell => cell.row == this.row + moves.leftatk[0] && cell.col == this.col + moves.leftatk[1]),
      rightatk: cells.find(cell => cell.row == this.row + moves.rightatk[0] && cell.col == this.col + moves.rightatk[1])
    }
  }

  // enPassant(){
  //   const enPassantRow = this.color === 'white' ? 6 : 2
  //   if (this.row != enPassantRow) return
  //   const LEFT = cells.find(cell => cell.row == enPassantRow && cell.col == this.col - 1)
  //   const RIGHT = cells.find(cell => cell.row == enPassantRow && cell.col == this.col + 1)
  //   const isEnemy = LEFT.owner.classList.contains
  // }

  go(choice){
    const moves = this.pawnMoves()
    let delta
    switch(choice){
      case 'forward':
        delta = moves.forward
        break
      case 'jump':
        if (this.started != null) return
        delta = moves.jump
        break
      case 'left':
        delta = moves.leftatk
        break
      case 'right':
        delta = moves.rightatk
        break
      default:
        return
    }
    const newRow = delta[0] + this.row
    const newCol = delta[1] + this.col
    this.moveTo(newRow,newCol)
    if (this.started === null) this.started = turnCount
    swapTurn()
  }
}

function getPiece(div){
  return pieces.find(piece => piece.div === div)
}

function getCell(row,col){
  const cell = cells.find(cell => cell.row === row && cell.col === col)
  cell.owner = cell.div.firstChild
  return cell
}

function swapTurn(){
  turnCount++
  turn = turnCount % 2 === 0 ? 'black' : 'white'
}

const p1b = new Pawn(4,4,'black')
const p1w = new Pawn(5,4,'white')

console.log(p1w.moves)
console.log(p1w.nowjumped)


console.log(cells)
console.log(pieces)

board.addEventListener('click', e => {
  console.log(e.target)
})

