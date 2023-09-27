const board = document.querySelector('#board')
const spaces = []
let aiDelay

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

  getLocation(){
    const loc = spaces.find(s => s.firstChild === this.piece)
    if (loc == null) return
    this.row = parseInt(loc.dataset.row)
    this.col = parseInt(loc.dataset.col)
    return loc
  }

  moveTo(space){
    space.appendChild(this.piece)
    this.getLocation()
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
        LAtkData != null &&
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
        RAtkData != null &&
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
        LAtkData != null &&
        LAtkData.space != null &&
        LAtkData.space.firstChild != null && 
        leftData != null &&
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
        RAtkData != null &&
        RAtkData.space != null &&
        RAtkData.space.firstChild != null &&
        rightData != null &&
        rightData.space != null &&
        rightData.space.firstChild != null &&
        rightData.data.side != this.side &&
        rightData.data.kind === 'pawn' &&
        turnCount - rightData.data.jumptime === 1) validCommands.push(goEnpassantRight)
    
    resetActive()
    if (turn === 'white') validCommands.forEach(c => {c.trigger.classList.add('active')})
    return validCommands
  }
}

class Rook extends Piece {
  constructor(row,col,side) {
    super(row,col,side)
    this.kind = 'rook'
    this.piece.classList.add(this.kind)
  }

  getAreas(){
    this.getLocation()
    const areas = []
    for (let n = 1; n <= 8; n++){
      const cell = getSpace(this.row - n,this.col)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece == null) areas.push(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side) {
        areas.push(cell)
        break
      }
    }

    for (let e = 1; e <= 8; e++){
      const cell = getSpace(this.row,this.col + e)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece == null) areas.push(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side) {
        areas.push(cell)
        break
      }
    }

    for (let s = 1; s <= 8; s++){
      const cell = getSpace(this.row + s,this.col)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece == null) areas.push(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side) {
        areas.push(cell)
        break
      }
    }

    for (let w = 1; w <= 8; w++){
      const cell = getSpace(this.row,this.col - w)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece == null) areas.push(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side) {
        areas.push(cell)
        break
      }
    }

    return areas
  }

  commands(){
    const triggers = this.getAreas()
    const validCommands = []
    const go = target => {
      this.moved = true
      this.moveTo(target)
    } 

    triggers.forEach(t => {
      const comm = {
        trigger: t,
        command(){
          const enemy = getData(t)
          if (enemy.piece != null) {
            t.removeChild(enemy.piece)
            remove(enemy.data)
          }
          go(t)
        }
      }
      validCommands.push(comm)
    })

    resetActive()
    if (turn === 'white') validCommands.forEach(c => {c.trigger.classList.add('active')})
    return validCommands
  }
}

class Knight extends Piece {
  constructor(row,col,side) {
    super(row,col,side)
    this.kind = 'knight'
    this.piece.classList.add(this.kind)
  }

  getAreas(){
    this.getLocation()
    const areas = []
    let temp = [
      getSpace(this.row - 2,this.col - 1),
      getSpace(this.row - 2,this.col + 1),
      getSpace(this.row - 1,this.col + 2),
      getSpace(this.row + 1,this.col + 2),
      getSpace(this.row + 2,this.col - 1),
      getSpace(this.row + 2,this.col + 1),
      getSpace(this.row - 1,this.col - 2),
      getSpace(this.row + 1,this.col - 2),
    ]
    
    for (let k = 0; k < temp.length; k++){
      const info = getData(temp[k])
      if (temp[k] == null) continue
      if (info != null && info.piece == null) areas.push(temp[k])
      if (info != null && info.data != null && info.piece != null && info.data.side != this.side) areas.push(temp[k])
    }

    return areas
  }

  commands(){
    const validCommands = []
    const triggers = this.getAreas()
    const go = target => {
      this.moved = true
      this.moveTo(target)
    } 

    triggers.forEach(t => {
      const c = {
        trigger: t,
        command(){
          const enemy = getData(t)
          if (enemy.piece != null) {
            t.removeChild(enemy.piece)
            remove(enemy.data)
          }
          go(t)
        }
      }
      validCommands.push(c)
    })

    resetActive()
    if (turn === 'white') validCommands.forEach(c => {c.trigger.classList.add('active')})
    return validCommands
  }
}

class Bishop extends Piece {
  constructor(row,col,side) {
    super(row,col,side)
    this.kind = 'bishop'
    this.piece.classList.add(this.kind)
  }

  getAreas(){
    this.getLocation()
    const areas = []

    for (let ne = 1; ne <= 8; ne++){
      const cell = getSpace(this.row - ne,this.col + ne)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece == null) areas.push(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side) {
        areas.push(cell)
        break
      }
    }

    for (let se = 1; se <= 8; se++){
      const cell = getSpace(this.row + se,this.col + se)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece == null) areas.push(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side) {
        areas.push(cell)
        break
      }
    }

    for (let sw = 1; sw <= 8; sw++){
      const cell = getSpace(this.row + sw,this.col - sw)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece == null) areas.push(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side) {
        areas.push(cell)
        break
      }
    }

    for (let nw = 1; nw <= 8; nw++){
      const cell = getSpace(this.row - nw,this.col - nw)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece == null) areas.push(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side) {
        areas.push(cell)
        break
      }
    }
    return areas
  }

  commands(){
    const triggers = this.getAreas()
    const validCommands = []
    const go = target => {
      this.moved = true
      this.moveTo(target)
    } 

    triggers.forEach(t => {
      const comm = {
        trigger: t,
        command(){
          const enemy = getData(t)
          if (enemy.piece != null) {
            t.removeChild(enemy.piece)
            remove(enemy.data)
          }
          go(t)
        }
      }
      validCommands.push(comm)
    })

    resetActive()
    if (turn === 'white') validCommands.forEach(c => {c.trigger.classList.add('active')})
    return validCommands
  }
}

class Queen extends Piece {
  constructor(row,col,side) {
    super(row,col,side)
    this.kind = 'queen'
    this.piece.classList.add(this.kind)
  }

  getAreas(){
    this.getLocation()
    const areas = []

    for (let ne = 1; ne <= 8; ne++){
      const cell = getSpace(this.row - ne,this.col + ne)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece == null) areas.push(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side) {
        areas.push(cell)
        break
      }
    }
    for (let se = 1; se <= 8; se++){
      const cell = getSpace(this.row + se,this.col + se)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece == null) areas.push(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side) {
        areas.push(cell)
        break
      }
    }
    for (let sw = 1; sw <= 8; sw++){
      const cell = getSpace(this.row + sw,this.col - sw)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece == null) areas.push(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side) {
        areas.push(cell)
        break
      }
    }
    for (let nw = 1; nw <= 8; nw++){
      const cell = getSpace(this.row - nw,this.col - nw)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece == null) areas.push(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side) {
        areas.push(cell)
        break
      }
    }
    for (let n = 1; n <= 8; n++){
      const cell = getSpace(this.row - n,this.col)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece == null) areas.push(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side) {
        areas.push(cell)
        break
      }
    }
    for (let e = 1; e <= 8; e++){
      const cell = getSpace(this.row,this.col + e)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece == null) areas.push(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side) {
        areas.push(cell)
        break
      }
    }
    for (let s = 1; s <= 8; s++){
      const cell = getSpace(this.row + s,this.col)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece == null) areas.push(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side) {
        areas.push(cell)
        break
      }
    }
    for (let w = 1; w <= 8; w++){
      const cell = getSpace(this.row,this.col - w)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece == null) areas.push(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side) {
        areas.push(cell)
        break
      }
    }

    return areas
  }

  commands(){
    const triggers = this.getAreas()
    const validCommands = []
    const go = target => {
      this.moved = true
      this.moveTo(target)
    } 

    triggers.forEach(t => {
      const comm = {
        trigger: t,
        command(){
          const enemy = getData(t)
          if (enemy.piece != null) {
            t.removeChild(enemy.piece)
            remove(enemy.data)
          }
          go(t)
        }
      }
      validCommands.push(comm)
    })

    resetActive()
    if (turn === 'white') validCommands.forEach(c => {c.trigger.classList.add('active')})
    return validCommands
  }
}

class King extends Piece{
  constructor(row,col,side){
    super(row,col,side)
    this.kind = 'king'
    this.piece.classList.add(this.kind)
    this.isChecked = false
  }

  getAreas(){
    this.getLocation()
    const areas = []
    let temp = [
      getSpace(this.row - 1,this.col - 1),
      getSpace(this.row - 1,this.col),
      getSpace(this.row - 1,this.col + 1),
      getSpace(this.row,this.col - 1),
      getSpace(this.row,this.col + 1),
      getSpace(this.row + 1,this.col - 1),
      getSpace(this.row + 1,this.col),
      getSpace(this.row + 1,this.col + 1)
    ]
    temp.forEach(cell => {
      if (cell == null) return
      const c = getData(cell)
      if (c.piece == null) areas.push(cell)
      if (c.piece != null && c.data.side == this.side) return
      if (c.piece != null && c.data.side != this.side) areas.push(cell)
    })
      
    return areas
  }

  onCheck(space){
    let check = false
    const location = getData(space)
    const row = location.row
    const col = location.col

    //knight
    let knightSpaces = [
      getSpace(row - 2,col - 1),
      getSpace(row - 2,col + 1),
      getSpace(row - 1,col + 2),
      getSpace(row + 1,col + 2),
      getSpace(row + 2,col - 1),
      getSpace(row + 2,col + 1),
      getSpace(row - 1,col - 2),
      getSpace(row + 1,col - 2)
    ]

    knightSpaces.forEach(cell => {
      if (cell == null) return
      const c = getData(cell)
      if (c.piece != null && 
          c.data.side != this.side && 
          c.data.kind === 'knight') check = true
    })

    //bishop
    for (let ne = 1; ne <= 8; ne++){
      const cell = getSpace(row - ne,col + ne)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side){
        if (c.data.kind === 'bishop' || c.data.kind === 'queen') {
          check = true
          break
        } 
      }
    }
    for (let se = 1; se <= 8; se++){
      const cell = getSpace(row + se,col + se)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side){
        if (c.data.kind === 'bishop' || c.data.kind === 'queen') {
          check = true
          break
        } 
      }
    }
    for (let sw = 1; sw <= 8; sw++){
      const cell = getSpace(row + sw,col - sw)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side){
        if (c.data.kind === 'bishop' || c.data.kind === 'queen') {
          check = true
          break
        } 
      }
    }
    for (let nw = 1; nw <= 8; nw++){
      const cell = getSpace(row - nw,col - nw)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side){
        if (c.data.kind === 'bishop' || c.data.kind === 'queen') {
          check = true
          break
        } 
      }
    }
    for (let n = 1; n <= 8; n++){
      const cell = getSpace(row - n,col)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side){
        if (c.data.kind === 'rook' || c.data.kind === 'queen') {
          check = true
          break
        } 
      }
    }
    for (let e = 1; e <= 8; e++){
      const cell = getSpace(row,col + e)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side){
        if (c.data.kind === 'rook' || c.data.kind === 'queen') {
          check = true
          break
        } 
      }
    }
    for (let s = 1; s <= 8; s++){
      const cell = getSpace(row + s,col)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side){
        if (c.data.kind === 'rook' || c.data.kind === 'queen') {
          check = true
          break
        } 
      }
    }
    for (let w = 1; w <= 8; w++){
      const cell = getSpace(row,col - w)
      if (cell == null) break
      const c = getData(cell)
      if (c.piece != null && c.data.side == this.side) break
      if (c.piece != null && c.data.side != this.side){
        if (c.data.kind === 'rook' || c.data.kind === 'queen') {
          check = true
          break
        } 
      }
    }
    
    //pawn
    let pawnDirection = this.side === 'white' ? -1 : 1
    const pawnSpaces = [
      getSpace(row + pawnDirection,col - 1),
      getSpace(row + pawnDirection,col + 1)
    ]
    pawnSpaces.forEach(p => {
      if (p == null) return
      const ps = getData(p)
      if (ps.piece != null && ps.data.side != this.side && ps.data.kind === 'pawn') check = true
    })


    return check
  }

  commands(){
    const triggers = this.getAreas()
    const validCommands = []
    const go = target => {
      this.moved = true
      this.moveTo(target)
    } 

    triggers.forEach(t => {
      const enemy = getData(t)
      const comm = {
        trigger: t,
        command(){
          if (enemy.piece != null) {
            t.removeChild(enemy.piece)
            remove(enemy.data)
          }
          go(t)
        }
      }
      validCommands.push(comm)
    })

    const row = this.side === 'white' ? 8 : 1
    const inkingL = getSpace(row,3)
    const inrookL = getSpace(row,4)
    const knightL = getSpace(row,2)
    
    const inkingR = getSpace(row,7)
    const inrookR = getSpace(row,6)

    const rookL = this.side === 'white' ? r1w : r1b
    const rookR = this.side === 'white' ? r2w : r2b

    const castlingL = {
      trigger: inkingL,
      command(){
        inrookL.appendChild(rookL.piece)
        go(inkingL)
      }
    }
    if (rookL.moved === false && 
        this.moved === false && 
        getData(inkingL).piece == null &&
        getData(inrookL).piece == null &&
        getData(knightL).piece == null) validCommands.push(castlingL)

    const castlingR = {
      trigger: inkingR,
      command(){
        inrookR.appendChild(rookR.piece)
        go(inkingR)
      }
    }
    if (rookR.moved === false && 
      this.moved === false && 
      getData(inkingR).piece == null &&
      getData(inrookR).piece == null) validCommands.push(castlingR)

    resetActive()
    if (turn === 'white') validCommands.forEach(c => {c.trigger.classList.add('active')})
    return validCommands
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
    aiDelay = Math.floor(Math.random() * 1000) + 500
    if (this.selectPiece()){
      setTimeout(() => {
        this.movePiece()
      }, aiDelay)
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
const r1b = new Rook(1,1,'black')
const r2b = new Rook(1,8,'black')
const k1b = new Knight(1,2,'black')
const k2b = new Knight(1,7,'black')
const b1b = new Bishop(1,3,'black')
const b2b = new Bishop(1,6,'black')
const qb = new Queen(1,4,'black')
const kb = new King(1,5,'black')

const kw = new King(8,5,'white')
const qw = new Queen(8,4,'white')
const p1w = new Pawn(7,1,'white')
const p2w = new Pawn(7,2,'white')
const p3w = new Pawn(7,3,'white')
const p4w = new Pawn(7,4,'white')
const p5w = new Pawn(7,5,'white')
const p6w = new Pawn(7,6,'white')
const p7w = new Pawn(7,7,'white')
const p8w = new Pawn(7,8,'white')
const r1w = new Rook(8,1,'white')
const r2w = new Rook(8,8,'white')
const k1w = new Knight(8,2,'white')
const k2w = new Knight(8,7,'white')
const b1w = new Bishop(8,3,'white')
const b2w = new Bishop(8,6,'white')



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
  kw.isChecked = kw.onCheck(getSpace(kw.row,kw.col))
  kb.isChecked = kb.onCheck(getSpace(kb.row,kb.col))
  turnCount++
  turn = turnCount % 2 === 0 ? 'black' : 'white'
  if (turn === 'black') bob.auto()
}

function remove(piece) {
  if (piece == null) return
  pieces = pieces.filter(p => p !== piece)
}