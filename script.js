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

class Pawn{
  constructor(row,col,color){
    this.row = row
    this.col = col
    this.color = color
    this.kind = "pawn"
    this.moves = this.moves(color)
    this.nowjumped = false
  }

  moves(color){
    const allMoves = [
      [//[0] BLACK
        {
          jump: [2,0],
          forward: [1,0],
          leftatk: [1,-1],  //enpassant L
          rightatk: [1,1]   //enpassant R
        },
      
      //[1] WHITE
        {
          jump: [-2,0],
          forward: [-1,0],
          leftatk: [-1,-1], //enpassant L
          rightatk: [-1,1]  //enpassant R
        }
      ]
    ]

    let moves
    if (color === 'white'){
      moves = allMoves[1]
    } else {
      moves = allMoves[0]
    }
    
    return moves
  }

  jumped() {
    this.nowjumped = true
  }
}

const p1w = new Pawn(7,1,"")

console.log(p1w)
console.log(p1w.nowjumped)
p1w.jumped()
console.log(p1w.nowjumped)