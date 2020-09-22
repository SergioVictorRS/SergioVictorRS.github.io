document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div '))
  const width = 10
  const ScoreDisplay = document.querySelector('#score')
  const StartBtn = document.querySelector('#start-button')

  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width*2, width*2, width*2+1]
  ]

  const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ]

  const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
  ]

  const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition = 4
  let currentRotation = 0
  //selecionar aleatoriamente um Tetromino e sua primeira rotacao

  let random = Math.floor(Math.random()*theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]

  // desenhar a primeira rotacao no primeiro iTetromino

  function draw() {
    current.forEach(index => {
      squares[currentPosition+index].classList.add('tetromino')
    })
  }


  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
    })
  }

  // fazer o tetromino descer a cada segundo

  timerId = setInterval(moveDown, 1000)

  // atribuir funcoes a keyCodes

  function control(e) {
    if(e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      //rotate
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

  // funcao move down

  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  // funcao freeze

  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains("taken"))) {
      current.forEach(index => squares[currentPosition + index].classList.add("taken"))

      // comecar um novo tetromino caindo

      random = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
    }
  }

  // mover o tetromino para a esquerda, a menos que esteja na borda ou haja um bloqueio

  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if(!isAtLeftEdge) currentPosition -= 1

    if(current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
      currentPosition += 1
    }

    draw()
  }


  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

    if(!isAtRightEdge) currentPosition += 1

    if(current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
      currentPosition -= 1
    }

    draw()
  }
})
