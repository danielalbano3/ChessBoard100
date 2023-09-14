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