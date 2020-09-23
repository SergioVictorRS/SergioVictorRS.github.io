document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div '))
  const width = 10
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  let nextRandom = 0
  let timerId
  let score = 0
  const colors = ['papayawhip', 'moccasin', 'peachpuff', 'palegoldenrod', 'khaki']
  //const colors = ['orange', 'red', 'purple', 'green', 'blue']

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
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }


  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }

  // fazer o tetromino descer a cada segundo

  //timerId = setInterval(moveDown, 1000)

  // atribuir funcoes a keyCodes

  function control(e) {
    if(e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
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

      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
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


  // rotacionar o Tetromino

  function rotate() {
    undraw()
    currentRotation++
    if(currentRotation === current.length) {
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
  }

  // mostrar proximo tetromino no display mini-grid

  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  let displayIndex = 0

  // os Tetrominos sem rotacoes

  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], // l
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //z
    [1, displayWidth, displayWidth+1, displayWidth+2], //t
    [0, 1, displayWidth, displayWidth+1], // o
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] // i
  ]

  // mostrar a forma no display mini-grid

  function displayShape() {
    // remove qualquer traco de um tetromino da grade inteira

    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  // adicionar funcionalidade ao botao

  startBtn.addEventListener('click', () => {
    if(timerId){
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 100)
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
    }
  })

  // adicionar scoreDisplay

  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => squares[index].classList.contains('taken'))){
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
        console.log(squaresRemoved)
      }
    }
  }

  // fim do jogo

  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      scoreDisplay.innerHTML = '**' + score + '**'
      clearInterval(timerId)
    }
  }
})
