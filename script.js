const board = document.querySelector('#board')
const spaces = []

let turnCount = 1
let turn = 'white' 
let pieces = []
let selectedPiece = null
const resetActive = () => {spaces.forEach(s => s.classList.remove('active','selected'))}

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
    this.signal = null

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

  isEnemy(piece) {
    return piece.side !== this.side
  }

  isNull(space) {
    return space == null
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

  commands(){
    const validCommands = []
    const area = this.getAreas()
    const go = target => {
      this.moved = true
      this.moveTo(target)
    } 

    const goForward = {
      trigger: area.Front,
      command: () => { 
        resetActive()
        area.Front.classList.add('active')
        go(area.Front) 
      }
    } 
    if (area.Front != null && area.Front.firstChild == null) validCommands.push(goForward)

    const goJump = {
      trigger: area.Jump,
      command: () => {
        go(area.Jump)
        this.jumptime = turnCount
      }
    }
    if (this.moved === false && 
        area.Front != null && area.Front.firstChild == null && 
        area.Jump != null && area.Jump.firstChild == null) validCommands.push(goJump)

    const goAttackLeft = {
      trigger: area.LAtk,
      command: () => {
        const enemy = getPiece(area.LAtk.firstChild)
        area.LAtk.removeChild(enemy.piece)
        remove(enemy)
        go(area.LAtk)
      }
    }
    const LAtkData = getData(area.LAtk)
    if (area.LAtk != null && 
        LAtkData.space != null &&
        LAtkData.space.firstChild != null && 
        LAtkData.data.side !== this.side) validCommands.push(goAttackLeft)

    const goAttackRight = {
      trigger: area.RAtk,
      command: () => {
        const enemy = getPiece(area.RAtk.firstChild)
        area.RAtk.removeChild(enemy.piece)
        remove(enemy)
        go(area.RAtk)
      }
    }
    const RAtkData = getData(area.RAtk)
    if (area.RAtk != null && 
        RAtkData.space != null &&
        RAtkData.space.firstChild != null && 
        RAtkData.data.side !== this.side) validCommands.push(goAttackRight)

    const goEnpassantLeft = {
      trigger: area.LAtk,
      command: () => {
        const enemy = getPiece(area.Left.firstChild)
        area.Left.removeChild(enemy.piece)
        remove(enemy)
        go(area.LAtk)
      }
    } 
    const leftData = getData(area.Left)
    if (area.LAtk != null && 
        LAtkData.space != null &&
        LAtkData.space.firstChild != null && 
        leftData.space != null &&
        leftData.space.firstChild != null &&
        leftData.data.side !== this.side && leftData.data.kind === 'pawn' &&
        turnCount - leftData.data.jumptime === 1) validCommands.push(goEnpassantLeft)

    const goEnpassantRight = {
      trigger: area.RAtk,
      command: () => {
        const enemy = getPiece(area.Right.firstChild)
        area.Right.removeChild(enemy.piece)
        remove(enemy)
        go(area.RAtk)
      }
    }
    const rightData = getData(area.Right)
    if (area.Right != null &&
        RAtkData.space != null &&
        RAtkData.space.firstChild != null &&
        rightData.space != null &&
        rightData.space.firstChild != null &&
        rightData.data.side != this.side &&
        rightData.data.kind === 'pawn' &&
        turnCount - rightData.data.jumptime === 1) validCommands.push(goEnpassantRight)
    
    resetActive()
    validCommands.forEach(c => {c.trigger.classList.add('active')})
    return validCommands
  }
}


class Rook extends Piece {
  constructor(row,col,side) {
    super(row,col,side)
    this.kind = 'rook'
    this.piece.classList.add(this.kind)
  }


}


class AIPlayer {
  randomPick(max){
    return Math.floor(Math.random() * max)
  }

  selectPiece(){
    let pcs = pieces.filter(p => p.side === 'black')
    let limit = pcs.length
    for (let i = 0; i < limit; i++){
      if (pcs == null || pcs.length == 0) return
      let testpiece = pcs[this.randomPick(pcs.length)]
      let cmdLength = testpiece.commands().length
      if (cmdLength > 0) {
        this.piece = testpiece
        return this.piece
      } else {
        pcs = pcs.filter(p => p !== testpiece)
      }
    }
  }

  movePiece(){
    if (this.piece == null) return
    const taskList = this.piece.commands()
    const task = taskList[this.randomPick(taskList.length)]
    task.command()
    resetActive()
    nextTurn()
  }

  auto(){
    if (this.selectPiece()){
      this.movePiece()
    } else {
      return
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

/*const r1w = new Rook(8,1,'white')*/

let targets = null
document.body.addEventListener('click', e => {
  if (turn === 'black') {
    return
  } else {
    const space = e.target.closest('.space')
    if (space == null) return
  
    const cell = getData(space)
    if (cell){
      if (cell.space.firstChild != null && cell.data.side === 'white'){
        selectedPiece = cell
        targets = cell.data.commands()
        highlightSelected()
      } else {
        const target = targets.find(t => t.trigger === cell.space)
        if (target == null) return
        target.command()
        resetActive()
        nextTurn()
      }
    }
  } 
})

function highlightSelected(){
  const space = selectedPiece.data.getLocation()
  space.classList.add('selected')
}

function getData(space){
  if (space == null) return null
  const info = {
    space: space,
    piece: space.firstChild,
    data: getPiece(space.firstChild),
    row: parseInt(space.dataset.row),
    col: parseInt(space.dataset.col),
  }

  return info
}

function getPiece(piece){
  if (piece == null) return 
  return pieces.find(p => p.piece === piece)
}

function nextTurn(){
  turnCount++
  turn = turnCount % 2 === 0 ? 'black' : 'white'
  if (turn === 'black') bob.auto()
}

function remove(piece) {
  if (piece == null) return
  pieces = pieces.filter(p => p !== piece)
}