let bInrookValid = true
let wInrookValid = true
const board = document.createElement("div")
board.classList.add("board")
document.body.appendChild(board)
for (let i = 0; i < 8; i++) {
  for (let j = 0; j < 8; j++) {
    const space = document.createElement("div")
    space.classList.add("space")
    space.dataset.row = i + 1
    space.dataset.col = j + 1
    if (j % 2 === 0) {
      space.classList.add(switchColor(i)[0])
    } else {
      space.classList.add(switchColor(i)[1])
    }
    board.appendChild(space)
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
function setPawn(color, row, col) {
  const pawn = document.createElement("div")
  pawn.classList.add("piece")
  pawn.dataset.piece = "pawn"
  pawn.dataset.color = color
  const space = findSpace(row, col)
  space.appendChild(pawn)
  return pawn
}
function setRook(color, row, col) {
  const rook = document.createElement("div")
  rook.classList.add("piece")
  rook.dataset.piece = "rook"
  rook.dataset.color = color
  const space = findSpace(row, col)
  space.appendChild(rook)
  return rook
}
function setKnight(color, row, col) {
  const knight = document.createElement("div")
  knight.classList.add("piece")
  knight.dataset.piece = "knight"
  knight.dataset.color = color
  const space = findSpace(row, col)
  space.appendChild(knight)
  return knight
}
function setBishop(color, row, col) {
  const bishop = document.createElement("div")
  bishop.classList.add("piece")
  bishop.dataset.piece = "bishop"
  bishop.dataset.color = color
  const space = findSpace(row, col)
  space.appendChild(bishop)
  return bishop
}
function setQueen(color, row, col) {
  const queen = document.createElement("div")
  queen.classList.add("piece")
  queen.dataset.piece = "queen"
  queen.dataset.color = color
  const space = findSpace(row, col)
  space.appendChild(queen)
  return queen
}
function setKing(color, row, col) {
  const king = document.createElement("div")
  king.classList.add("piece")
  king.dataset.piece = "king"
  king.dataset.color = color
  const space = findSpace(row, col)
  space.appendChild(king)
  return king
}
function findSpace(row, col) {
  let found
  spaces.forEach((space) => {
    if (space.dataset.row == row && space.dataset.col == col) {
      found = space
    }
  })
  return found
}
const p1b = setPawn("black", 2, 1)
const p2b = setPawn("black", 2, 2)
const p3b = setPawn("black", 2, 3)
const p4b = setPawn("black", 2, 4)
const p5b = setPawn("black", 2, 5)
const p6b = setPawn("black", 2, 6)
const p7b = setPawn("black", 2, 7)
const p8b = setPawn("black", 2, 8)
const p1w = setPawn("white", 7, 1)
const p2w = setPawn("white", 7, 2)
const p3w = setPawn("white", 7, 3)
const p4w = setPawn("white", 7, 4)
const p5w = setPawn("white", 7, 5)
const p6w = setPawn("white", 7, 6)
const p7w = setPawn("white", 7, 7)
const p8w = setPawn("white", 7, 8)
const r1b = setRook("black", 1, 1)
const r2b = setRook("black", 1, 8)
const r1w = setRook("white", 8, 1)
const r2w = setRook("white", 8, 8)
const k1b = setKnight("black", 1, 2)
const k2b = setKnight("black", 1, 7)
const k1w = setKnight("white", 8, 2)
const k2w = setKnight("white", 8, 7)
const b1b = setBishop("black", 1, 3)
const b2b = setBishop("black", 1, 6)
const b1w = setBishop("white", 8, 3)
const b2w = setBishop("white", 8, 6)
const qb = setQueen("black", 1, 4)
const qw = setQueen("white", 8, 4)
const kb = setKing("black", 1, 5)
const kw = setKing("white", 8, 5)
// const blackPieces = [
//   p1b,p2b,p3b,p4b,p5b,p6b,p7b,p8b,
//   r1b,k1b,b1b,qb,kb,b2b,k2b,r2b
// ]
let turn = "white"
const selectedPiece = []
const validMoves = []
function switchTurn() {
  turn == "white" ? (turn = "black") : (turn = "white")
  turnLabel.innerText = `Turn: ${turn}`
}

spaces.forEach(space => {
  space.addEventListener('click', () => {
    // if (turn == 'black') return
    if (selectedPiece.length == 0){
      if (space.firstChild == null){
        return
      } else {
        if (space.firstChild.dataset.color == turn){
          selectedPiece.push(space.firstChild)
          showMoves(space)
        } else if (space.firstChild.dataset.color !== turn){
          return
        }
      }
    } else {
      if (validMoves.includes(space)){
        movePiece(space)
        // runAI()
        resetSelect()
      } else {
        if (space.firstChild == null){
          return
        } else {
          if (space.firstChild.dataset.color == turn){
            resetSelect()
            selectedPiece.push(space.firstChild)
            showMoves(space)
          } else {
            return
          }
        }
      }
    }
  })
})

function movePiece(space) {
  const piece = selectedPiece[0]
  if (space.firstChild != null){
    space.removeChild(space.firstChild)
  }

  if (piece.dataset.piece == 'king'){
    if(turn == 'black' && bInrookValid && findSpace(1,7)) {
      findSpace(1,6).appendChild(r2b)
    } else if (turn == 'white' && wInrookValid && space == findSpace(8,7)){
      findSpace(8,6).appendChild(r2w)
    }
  }

  space.appendChild(piece)
  switchTurn()
}

function resetSelect() {
  selectedPiece.length = 0
  validMoves.length = 0
  spaces.forEach(item => {
    item.classList.remove("active")
    item.classList.remove("valid")
  })
}

function highlightValidMoves() {
  selectedPiece[0].closest('.space').classList.add('active')
  if (validMoves.length == 0) return
  if (selectedPiece.length == 0) return
  validMoves.forEach((space) => {
    space.classList.add('valid')
  })
}

function showMoves(space){
  const piece = selectedPiece[0]
  const row = space.dataset.row
  const col = space.dataset.col

  switch(piece.dataset.piece){
    case 'pawn':
      const color = piece.dataset.color
      pawnMoves(color,row,col)
      break
    case 'rook':
      rookMoves(row,col)
      break
    case 'bishop':
      bishopMoves(row,col)
      break
    case 'king':
      kingMoves(row,col)
      break
    case 'queen':
      queenMoves(row,col)
      break
    case 'knight':
      knightMoves(row,col)
      break
    default:
      return
  }
  highlightValidMoves()
}

function pawnMoves(color,row,col){
  const delta = allMoves[0]
  let i
  color == 'black' ? i = 0 : i = 4
  const pRow = parseInt(row)
  const pCol = parseInt(col)

  //step
  const stepRow = parseInt(delta[i + 0][0])
  const stepCol = parseInt(delta[i + 0][1])
  const step = findSpace(stepRow + pRow, stepCol + pCol)
  if (step !== null) {
    if (step.firstChild == null) validMoves.push(step)
  }

  //jump
  let j
  color == 'black' ? j = 0 : j = 1
  const iJump = parseInt(delta[8][j])
  const jumpRow = parseInt(delta[i + 1][0])
  const jumpCol = parseInt(delta[i + 1][1])
  const jump = findSpace(jumpRow + pRow, jumpCol + pCol)
  if (pRow == iJump) {
    if (step.firstChild == null && jump.firstChild == null) validMoves.push(jump)
  }

  //leftAtk
  const leftAtkRow = parseInt(delta[i + 2][0])
  const leftAtkCol = parseInt(delta[i + 2][1])
  const leftAtk = findSpace(leftAtkRow + pRow, leftAtkCol + pCol)
  if (leftAtk != null){
    if (leftAtk.firstChild != null){
      if (leftAtk.firstChild.dataset.color != turn) validMoves.push(leftAtk)
    }
  }

  //rightAtk
  const rightAtkRow = parseInt(delta[i + 3][0])
  const rightAtkCol = parseInt(delta[i + 3][1])
  const rightAtk = findSpace(rightAtkRow + pRow, rightAtkCol + pCol)
  if (rightAtk != null){
    if (rightAtk.firstChild != null){
      if (rightAtk.firstChild.dataset.color != turn) validMoves.push(rightAtk)
    }
  }

}

function rookMoves(row,col){
  const delta = allMoves[1]
  //up 
  for (let i = 0; i < 7; i++){
    let rRow = parseInt(delta[i][0])
    let rCol = parseInt(delta[i][1])
    let rSpace = findSpace(rRow + parseInt(row), rCol + parseInt(col))
    if (rSpace == null){
      break
    } else {
      if (rSpace.firstChild !== null){
        if (rSpace.firstChild.dataset.color == turn){
          break
        } else if (rSpace.firstChild.dataset.color !== turn){
          validMoves.push(rSpace)
          break
        }
      } else if (rSpace.firstChild == null){
        validMoves.push(rSpace)
      }
    }
  }
  //down
  for (let i = 7; i < 14; i++){
    let rRow = parseInt(delta[i][0])
    let rCol = parseInt(delta[i][1])
    let rSpace = findSpace(rRow + parseInt(row), rCol + parseInt(col))
    if (rSpace == null){
      break
    } else {
      if (rSpace.firstChild !== null){
        if (rSpace.firstChild.dataset.color == turn){
          break
        } else if (rSpace.firstChild.dataset.color !== turn){
          validMoves.push(rSpace)
          break
        }
      } else if (rSpace.firstChild == null){
        validMoves.push(rSpace)
      }
    }
  }
  //left 14-21
  for (let i = 14; i < 21; i++){
    let rRow = parseInt(delta[i][0])
    let rCol = parseInt(delta[i][1])
    let rSpace = findSpace(rRow + parseInt(row), rCol + parseInt(col))
    if (rSpace == null){
      break
    } else {
      if (rSpace.firstChild !== null){
        if (rSpace.firstChild.dataset.color == turn){
          break
        } else if (rSpace.firstChild.dataset.color !== turn){
          validMoves.push(rSpace)
          break
        }
      } else if (rSpace.firstChild == null){
        validMoves.push(rSpace)
      }
    }
  }
  //right 21-28
  for (let i = 21; i < 28; i++){
    let rRow = parseInt(delta[i][0])
    let rCol = parseInt(delta[i][1])
    let rSpace = findSpace(rRow + parseInt(row), rCol + parseInt(col))
    if (rSpace == null){
      break
    } else {
      if (rSpace.firstChild !== null){
        if (rSpace.firstChild.dataset.color == turn){
          break
        } else if (rSpace.firstChild.dataset.color !== turn){
          validMoves.push(rSpace)
          break
        }
      } else if (rSpace.firstChild == null){
        validMoves.push(rSpace)
      }
    }
  }
  
}

function bishopMoves(row,col){
  const delta = allMoves[2]
  for (let i = 0; i < 7; i++){
    let rRow = parseInt(delta[i][0])
    let rCol = parseInt(delta[i][1])
    let rSpace = findSpace(rRow + parseInt(row), rCol + parseInt(col))
    if (rSpace == null){
      break
    } else {
      if (rSpace.firstChild !== null){
        if (rSpace.firstChild.dataset.color == turn){
          break
        } else if (rSpace.firstChild.dataset.color !== turn){
          validMoves.push(rSpace)
          break
        }
      } else if (rSpace.firstChild == null){
        validMoves.push(rSpace)
      }
    }
  }
  for (let i = 7; i < 14; i++){
    let rRow = parseInt(delta[i][0])
    let rCol = parseInt(delta[i][1])
    let rSpace = findSpace(rRow + parseInt(row), rCol + parseInt(col))
    if (rSpace == null){
      break
    } else {
      if (rSpace.firstChild !== null){
        if (rSpace.firstChild.dataset.color == turn){
          break
        } else if (rSpace.firstChild.dataset.color !== turn){
          validMoves.push(rSpace)
          break
        }
      } else if (rSpace.firstChild == null){
        validMoves.push(rSpace)
      }
    }
  }
  for (let i = 14; i < 21; i++){
    let rRow = parseInt(delta[i][0])
    let rCol = parseInt(delta[i][1])
    let rSpace = findSpace(rRow + parseInt(row), rCol + parseInt(col))
    if (rSpace == null){
      break
    } else {
      if (rSpace.firstChild !== null){
        if (rSpace.firstChild.dataset.color == turn){
          break
        } else if (rSpace.firstChild.dataset.color !== turn){
          validMoves.push(rSpace)
          break
        }
      } else if (rSpace.firstChild == null){
        validMoves.push(rSpace)
      }
    }
  }
  for (let i = 21; i < 28; i++){
    let rRow = parseInt(delta[i][0])
    let rCol = parseInt(delta[i][1])
    let rSpace = findSpace(rRow + parseInt(row), rCol + parseInt(col))
    if (rSpace == null){
      break
    } else {
      if (rSpace.firstChild !== null){
        if (rSpace.firstChild.dataset.color == turn){
          break
        } else if (rSpace.firstChild.dataset.color !== turn){
          validMoves.push(rSpace)
          break
        }
      } else if (rSpace.firstChild == null){
        validMoves.push(rSpace)
      }
    }
  }
}

function kingMoves(row,col){
  const delta = allMoves[3]
  for (i = 0; i < delta.length - 1; i++){
    let kMoves = delta[i]
    let kRow = parseInt(kMoves[0])
    let kCol = parseInt(kMoves[1])
    let kSpace = findSpace(kRow + parseInt(row),kCol + parseInt(col))
    if (kSpace != null){
      if (kSpace.firstChild == null){
        validMoves.push(kSpace)
      } else {
        if (kSpace.firstChild.dataset.color != turn) validMoves.push(kSpace)
      }
    }
  }

  checkInRook()
}

function checkInRook(){
  if (!inRookMoveClear() || !inRookSpaceClear()) return
  let kingIR
  if (turn == 'white'){
    kingIR = findSpace(8,7)
  } else {
    kingIR = findSpace(1,7)
  }
  validMoves.push(kingIR)
}

function inRookSpaceClear(){
  if (selectedPiece[0] == null) return
  if (selectedPiece[0].dataset.piece !== 'king') return
  const king = selectedPiece[0]
  const kingSpace = king.closest('.space')
  const kRow = parseInt(kingSpace.dataset.row)
  const kCol = parseInt(kingSpace.dataset.col)
  
  const bishopSpace = findSpace(kRow,kCol + 1)
  const knightSpace = findSpace(kRow,kCol + 2)

  const spaceFree = bishopSpace.firstChild == null && knightSpace.firstChild == null
  return spaceFree
}

function inRookMoveClear(){
  let result
  const bKingSpace = findSpace(1,5).firstChild
  const bRookSpace = findSpace(1,8).firstChild
  const wKingSpace = findSpace(8,5).firstChild
  const wRookSpace = findSpace(8,8).firstChild
  if (bKingSpace == null || bRookSpace == null) bInrookValid = false
  if (wKingSpace == null || wRookSpace == null) wInrookValid = false
  turn == 'white' ? result = wInrookValid : result = bInrookValid
  return result
}

function queenMoves(row,col){
  rookMoves(row,col)
  bishopMoves(row,col)
}
function knightMoves(row,col){
  const delta = allMoves[4]
  for (let i = 0; i < delta.length; i++){
    const knRow = parseInt(delta[i][0])
    const knCol = parseInt(delta[i][1])
    const knSpace = findSpace(knRow + parseInt(row), knCol + parseInt(col))
    if (knSpace != null){
      if (knSpace.firstChild == null){
        validMoves.push(knSpace)
      } else {
        if (knSpace.firstChild.dataset.color != turn) validMoves.push(knSpace)
      }
    }
  }
}

const allMoves = [
  //pawnb [0]Down
  [
    //blackpawns
    //1step[0]
    [1, 0],
    //2step [1]
    [2, 0],
    //leftAtk [2]
    [1, -1],
    //rightAtk [3]
    [1, 1],

    //whitepawns
    //1step [4]
    [-1, 0],
    //2step [5]
    [-2, 0],
    //leftAtk [6]
    [-1, -1],
    //rightAtk[7]
    [-1, 1],

    //blackrow, whiterow [8]
    //init
    [2,7]
  ],

  //rook [2]
  [
    //up [0-6]
      [-1, 0],
      [-2, 0],
      [-3, 0],
      [-4, 0],
      [-5, 0],
      [-6, 0],
      [-7, 0],
    

    //down [7-13]
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [7, 0],

    //left [14-20]
    
      [0, -1],
      [0, -2],
      [0, -3],
      [0, -4],
      [0, -5],
      [0, -6],
      [0, -7],
    

    //right [21-27]
    
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
      [0, 7],
    

    //in-rook [28]***
    
      [0, -2]
    
  ],

  //bishop [3]
  [
    //leftUp
      [-1, -1],
      [-2, -2],
      [-3, -3],
      [-4, -4],
      [-5, -5],
      [-6, -6],
      [-7, -7],

    //rightUp
      [-1, 1],
      [-2, 2],
      [-3, 3],
      [-4, 4],
      [-5, 5],
      [-6, 6],
      [-7, 7],
    

    //rightDown[2]
    
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5],
      [6, 6],
      [7, 7],
    

    //leftDown[3]
    
      [1, -1],
      [2, -2],
      [3, -3],
      [4, -4],
      [5, -5],
      [6, -6],
      [7, -7],
    
  ],

  //king [4]
  [
    //up[0]
    [-1, 0],
    //upRight[1]
    [-1, 1],
    //right[2]
    [0, 1],
    //downRight[3]
    [1, 1],
    //down[4]
    [1, 0],
    //downLeft[5]
    [1, -1],
    //left[6]
    [0, -1],
    //upLeft[7]
    [-1, -1],

    //inRook[8]**
    [0, 2]
  ],

  //knight [5]
  [
    //upLeft [0]
    [-2,-1],
    //upRight [1]
    [-2,1],

    //rightUp [2]
    [-1,2],
    //rightDown [3]
    [1,2],

    //downLeft [4]
    [2,-1],
    //downRight [5]
    [2,1],

    //leftUp [6]
    [-1,-2],
    //leftUp [7]
    [1,-2]
  ],

  //queen = [2] + [3]
]

const turnLabel = document.createElement('div')
turnLabel.dataset.label = ''
turnLabel.innerText = `Turn: ${turn}`
document.body.appendChild(turnLabel)

const timer = document.createElement('div')
timer.dataset.timer = ''
document.body.appendChild(timer)

let i = 0
let sec = 0
let min = 0
let hr = 0
function timerFunc(duration){
  setTimeout(() => {
    i++
    sec = i
    if (sec == 60){
      sec = 0
      i = 0
      min++
    }
    if (min == 60){
      min = 0
      hr++
    }
    timer.innerText = `Time:\n ${hr}:${min}:${sec}`
    timerFunc(duration)
  },duration)
  return i
}
timerFunc(1000)

const title = document.createElement('div')
title.dataset.title = ''
title.innerText = 'Chess Board 100'
document.body.appendChild(title)