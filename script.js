const board = document.querySelector('#board')

let turnCount = 1
let turn = 'white' 
const spaces = []
let pieces = []


for (let r = 1; r <= 8; r++){
  for (let c = 1; c <= 8; c++){
    const space = document.createElement('div')
    space.dataset.row = r
    space.dataset.col = c
    if (r % 2 == 0){
      cellColor = c % 2 == 0 ? 'orange' : 'tan'
    } else {
      cellColor = c % 2 == 0 ? 'tan' : 'orange'
    }
    space.classList.add('space',cellColor)
    spaces.push(space)
    board.appendChild(space)
  }
}

function getSpace(row,col){
  return spaces.find(s => parseInt(s.dataset.row) === row && parseInt(s.dataset.col) === col)
}

function getPiece(htmldiv){
  return pieces.find(p => p.piece === htmldiv)
}

function isWhite(htmldiv){
  return htmldiv.classList.contains('white')
}

class Piece{
  constructor(row,col,side){
    this.row = row
    this.col = col
    this.side = side

    const div = document.createElement('div')
    div.classList.add('piece', this.side)
    getSpace(this.row,this.col).appendChild(div)

    this.piece = div
    pieces.push(this)
  }

}

class Pawn extends Piece{
  constructor(row,col,side){
    super(row,col,side)
    this.kind = 'pawn'
    this.jumptime = 0
    this.moved = false
    this.direction = side === 'black' ? 1 : -1
    this.piece.classList.add(this.kind)
  }

  moveTo(space){
    space.appendChild(this.piece)
    this.getLocation()
  }

  getLocation(){
    const loc = spaces.find(s => s.firstChild === this.piece)
    this.row = parseInt(loc.dataset.row)
    this.col = parseInt(loc.dataset.col)
  }

  getMoves(){
    this.getLocation()
    const moves = []
    const areas = {
      forwardArea: getSpace(this.row + this.direction,this.col),
      jumpArea: getSpace(this.row + 2 * this.direction,this.col),
      leftAtk: getSpace(this.row + this.direction,this.col - 1),
      rightAtk: getSpace(this.row + this.direction,this.col + 1),
      sideLeft: getSpace(this.row,this.col - 1),
      sideRight: getSpace(this.row,this.col + 1),
    }

    if (areas.forwardArea != null && areas.forwardArea.firstChild == null){
      moves.push({
        fn: () => {
          this.moveTo(areas.forwardArea)
        },
        destination: areas.forwardArea
      })
    }

    return moves
  }

  commands(option){
    const tasks = this.getMoves()
    const length = tasks.length
    //forward
    
    //jump
    //leftatk
    //rightatk
    //epLeft
    //epRight

    tasks[option].fn()
    this.moved = true
  }
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

const p1b = new Pawn(1,3,'black')
const p1w = new Pawn(1,2,'white')

const selectedPiece = []
document.body.addEventListener('click', e => {
  if (turn === 'black') return
  if (!e.target.classList.contains('piece') && !e.target.classList.contains('space')) return
  
  if (e.target.classList.contains('white') && e.target.classList.contains('piece')) {
    selectedPiece[0] = e.target
  } else {
    //react if target is valid and run command
    //commands[0]...[n]
    return
  }
  
})

