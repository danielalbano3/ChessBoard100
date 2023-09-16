const board = document.createElement("div")
const cells = []
board.classList.add("board")
document.body.appendChild(board)
for (let i = 1; i <= 8; i++) {
  for (let j = 1; j <= 8; j++) {
    const space = document.createElement("div")
    space.classList.add("space")
    space.dataset.row = i
    space.dataset.col = j
    const cell = {
      row: i,
      col: j,
      div: space
    }
    if (j % 2 === 0) {
      space.classList.add(switchColor(i)[0])
    } else {
      space.classList.add(switchColor(i)[1])
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

class Pawn{
  constructor(row,col,color){
    this.row = row
    this.col = col
    this.color = color
    this.kind = "pawn"
    this.nowjumped = false
    this.piece = this.render()
    this.moveTo(row,col)
  }

  render(){
    const piece = document.createElement('div')
    piece.dataset.piece = this.kind
    piece.dataset.color = this.color
    piece.classList.add('piece')
    return piece
  }

  allmoves(){
    const x = this.color === 'white' ? -1 : 1
    const moves = {
      forward: [1*x,0],
      jump: [2*x,0],
      leftatk: [1*x,-1],  //enpassant L
      rightatk: [1*x,1]   //enpassant R
    }
    return moves
  }

  go(choice){
    const moves = this.allmoves()
    let delta
    switch(choice){
      case 'forward':
        delta = moves.forward
        break
      case 'jump':
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
    const cell = cells.find(cell => cell.row == newRow && cell.col == newCol)
    const space = cell.div
    if (space == null) return
    space.appendChild(this.piece)
    this.row = newRow
    this.col = newCol
  }

  moveTo(row,col){
    const cell = cells.find(cell => cell.row == row && cell.col == col)
    const space = cell.div
    space.appendChild(this.piece)
    this.row = row
    this.col = col
  }
}

const p1w = new Pawn(4,4,"black")

console.log(p1w.moves)
console.log(p1w.nowjumped)


console.log(cells)

board.addEventListener('click', e => {
  console.log(e.target)
})