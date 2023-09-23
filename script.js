const board = document.querySelector('#board')
const spaces = []

let turnCount = 1
let turn = 'white' 
let pieces = []
let selectedPiece = null


for (let r = 1; r <= 8; r++){
  for (let c = 1; c <= 8; c++){
    const space = document.createElement('div')
    space.dataset.row = r
    space.dataset.col = c
    let cellColor
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

class Piece{
  constructor(row,col,side){
    this.row = row
    this.col = col
    this.side = side
    this.moved = false

    const div = document.createElement('div')
    div.classList.add('piece', this.side)
    getSpace(this.row,this.col).appendChild(div)

    this.piece = div
    pieces.push(this)
  }

  goToRowCol(row,col){
    const space = getSpace(row,col)
    this.moveTo(space)
  }

  moveTo(space){
    space.appendChild(this.piece)
    this.getLocation()
  }

  getLocation(){
    const loc = spaces.find(s => s.firstChild === this.piece)
    this.row = parseInt(loc.dataset.row)
    this.col = parseInt(loc.dataset.col)
    return loc
  }
}

class Pawn extends Piece {
  constructor(row,col,side){
    super(row,col,side)
    this.kind = 'pawn'
    this.jumptime = 0
    this.direction = side === 'black' ? 1 : -1
    this.piece.classList.add(this.kind)
  }

  getAreas(){
    this.getLocation()
    const areas = {
      Front: getSpace(this.row + this.direction,this.col),
      Jump: getSpace(this.row + 2 * this.direction,this.col),
      LAtk: getSpace(this.row + this.direction,this.col - 1),
      RAtk: getSpace(this.row + this.direction,this.col + 1),
      Left: getSpace(this.row,this.col - 1),
      Right: getSpace(this.row,this.col + 1),
    }
    return areas
  }

  getMoves(){
    const moves = []
    const areas = this.getAreas()
    
    const front = getData(areas.Front)
    if (front != null && front.owner == null) moves.push({move: front, moveName: 'Forward'})
    
    const jump = getData(areas.Jump)
    if (front != null && front.owner == null && jump != null && jump.owner == null && this.moved === false) moves.push({move: jump, moveName: 'Jump'})
    
    const lAtk = getData(areas.LAtk)
    if (lAtk != null && lAtk.owner != null && lAtk.ownerData.side !== this.side) moves.push({move: lAtk, moveName: 'Left Attack'})
    
    const leftSide = getData(areas.Left)
    if (lAtk != null && 
      lAtk.owner == null && 
      leftSide != null && 
      leftSide.owner != null && 
      leftSide.ownerData.side !== this.side &&
      leftSide.ownerData.kind === 'pawn' &&
      turnCount - parseInt(leftSide.ownerData.jumptime) === 1) moves.push({move: lAtk, moveName: 'enPassant Left'})
      
    const rAtk = getData(areas.RAtk)
    if (rAtk != null && rAtk.owner != null && rAtk.ownerData.side !== this.side) moves.push({move: rAtk, moveName: 'Right Attack'})
      
    const rightSide = getData(areas.Right)
    if (rAtk != null && 
        rAtk.owner == null && 
        rightSide != null && 
        rightSide.owner != null && 
        rightSide.ownerData.side !== this.side &&
        rightSide.ownerData.kind === 'pawn' &&
        turnCount - parseInt(rightSide.ownerData.jumptime) === 1) moves.push({move: rAtk, moveName: 'enPassant Right'})
          
    spaces.forEach(s => s.classList.remove('active'))
    moves.forEach(m => {
      m.move.space.classList.add('active')
    })
    return moves
  }

  commands(){
    const moves = this.getMoves()

    const validCommands = []
    const areas = this.getAreas()
    const frontSpace = areas.Front
    const jumpSpace = areas.Jump
    const leftAtkSpace = areas.LAtk
    const rightAtkSpace = areas.RAtk

    const leftSide = areas.Left
    const rightSide = areas.Right
 
    const goForward = () => {
      this.moveTo(frontSpace)
    }
    if (moves.some(m => m.moveName === 'Forward')) validCommands.push(goForward)

    const goJump = () => {
      this.moveTo(jumpSpace)
      this.jumptime = turnCount
    }
    if (moves.some(m => m.moveName === 'Jump')) validCommands.push(goJump)

    const goAtkLeft = () => {
      const leftatk = getData(leftAtkSpace)
      pieces = pieces.filter(p => p !== leftatk.ownerData)
      leftAtkSpace.removeChild(leftatk.owner)
      this.moveTo(leftAtkSpace)
    }
    if (moves.some(m => m.moveName === 'Left Attack')) validCommands.push(goAtkLeft)

    const goAtkRight = () => {
      const rightatk = getData(rightAtkSpace)
      pieces = pieces.filter(p => p !== rightatk.ownerData)
      rightAtkSpace.removeChild(rightatk.owner)
      this.moveTo(rightAtkSpace)
    }
    if (moves.some(m => m.moveName === 'Right Attack')) validCommands.push(goAtkRight)

    const enpassantL = () => {
      const epL = getData(leftSide)
      pieces = pieces.filter(p => p !== epL.ownerData)
      leftSide.removeChild(epL.owner)
      this.moveTo(leftAtkSpace)
    }
    if (moves.some(m => m.moveName === 'enPassant Left')) validCommands.push(enpassantL)

    const enpassantR = () => {
      const epR = getData(rightSide)
      pieces = pieces.filter(p => p !== epR.ownerData)
      rightSide.removeChild(epR.owner)
      this.moveTo(rightAtkSpace)
    }
    if (moves.some(m => m.moveName === 'enPassant Right')) validCommands.push(enpassantR)

    return validCommands
  }

  execute(command){
    const allCommands = this.commands()
    if (allCommands.length === 0) {
      return
    } else {
      command = command % allCommands.length
      allCommands[command]()
      this.moved = true
      spaces.forEach(s => s.classList.remove('active','selected'))
      nextTurn()
    } 
  }

}

class Rook extends Piece {
  constructor(row,col,side) {
    super(row,col,side)
    this.kind = 'rook'
    this.piece.classList.add(this.side)
  }
}

class AIPlayer {
  randomPick(max){
    return Math.floor(Math.random() * max)
  }

  selectPiece(){
    const pcs = pieces.filter(p => p.side === 'black')
    let length = pcs.length
    this.piece = pcs[this.randomPick(length)]
  }

  selectCommand(){
    if (this.piece.commands().length === 0) {
      this.auto() 
      return
    }
    this.piece.execute(this.randomPick(this.piece.commands().length))
  }

  auto(){
    const pcs = pieces.filter(p => p.side === 'black')
    if (pcs.length === 0){
      return
    } else {
      pcs.length > 1 ? this.selectPiece() : this.piece = pcs[0]
      if (this.piece.commands().length === 0 && pcs.length === 1) return
      this.selectCommand()
    }
  }
}

const bob = new AIPlayer()
const p1b = new Pawn(2,1,'black')
const p2b = new Pawn(2,2,'black')
const p3b = new Pawn(2,3,'black')
const p4b = new Pawn(2,4,'black')
const p5b = new Pawn(2,5,'black')
const p6b = new Pawn(2,6,'black')
const p7b = new Pawn(2,7,'black')
const p8b = new Pawn(2,8,'black')

const p1w = new Pawn(7,1,'white')
const p2w = new Pawn(7,2,'white')
const p3w = new Pawn(7,3,'white')
const p4w = new Pawn(7,4,'white')
const p5w = new Pawn(7,5,'white')
const p6w = new Pawn(7,6,'white')
const p7w = new Pawn(7,7,'white')
const p8w = new Pawn(7,8,'white')

document.body.addEventListener('click', e => {
  if (turn === 'black') return

  const space = e.target.closest('.space')
  if (space == null) return
  const data = getData(space)
  const owner = data.owner
  const piece = getPiece(owner)

  const movesArr = []
  if (piece != null && piece.side === 'white'){
    selectedPiece = piece
    selectedPiece.commands()
    highlightSelected()
  } 
  
  if (space.classList.contains('active')) {
    selectedPiece.getMoves().forEach(m => {
      movesArr.push(m.move.space)
    })
    let index = movesArr.indexOf(space)
    selectedPiece.execute(index)
  }

})

function highlightSelected(){
  spaces.forEach(s => s.classList.remove('selected'))
  const space = selectedPiece.getLocation()
  space.classList.add('selected')
}

function getData(space){
  if (space == null) return null
  const data = {}
  data.space = space
  data.owner = space.firstChild
  data.ownerData = this.getPiece(space.firstChild)
  data.row = parseInt(space.dataset.row)
  data.col = parseInt(space.dataset.col)
  return data
}

function getPiece(piece){
  if (piece == null) return null
  return pieces.find(p => p.piece === piece)
}

function nextTurn(){
  turnCount++
  turn = turnCount % 2 === 0 ? 'black' : 'white'
  if (turn === 'black') bob.auto()
}