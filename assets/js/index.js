window.onload = () => {

  document.getElementById('max-score').innerText = localStorage.getItem('maxScore') || 0;
  setInterval(() => {
    document.getElementById('snake-logo').classList.toggle('shake-bottom')
  }, 3000)

  // #region d Press Handler 
  window.addEventListener('keydown', async e => {

    switch (e.code){
      case 'NumpadAdd':
        if (speed >= 1) speed -= 0.5
        else alert("Speed can't go higher than that")
        break;
      case 'NumpadSubtract':
        if (speed <= 10) speed += 0.5
        else alert("Speed can't go lower than that")
        break;
      case 'KeyP':
        displayOptions();
        break;
      case 'Enter':
        resetGame();
        await sleep(500)
        startGame();
        break;
      case 'Space':
        toggleGameState();
        break;
      case 'KeyW':
        if(d !== 's') changeDirection('w');
        new Howl({
          src: ['assets/sounds/up.mp3']
        }).play();
        break;
      case 'KeyS':
        if(d !== 'w') changeDirection('s');
        break;
      case 'KeyD':
        if(d !== 'a') changeDirection('d');
        break;
      case 'KeyA':
        if(d !== 'd') changeDirection('a');
        break;
      case 'ArrowUp':
        if(d !== 's') changeDirection('w');
        break;
      case 'ArrowDown':
        if(d !== 'w') changeDirection('s');
        break;
      case 'ArrowRight':
        if(d !== 'a') changeDirection('d');
        break;
      case 'ArrowLeft':
        if(d !== 'd') changeDirection('a');
        break;
      default:
        console.log(e.code);
        break;
    }
  })
  
  //#endregion
}

const exitOptionsMenu = document.getElementById('close-options-menu');
const reset           = document.getElementById('reset');
const toggle          = document.getElementById('toggle');
const options         = document.getElementById('options');
const main            = document.getElementById('main');
const cvs             = document.getElementById('cvs');
const ctx             = cvs.getContext('2d');

// #region Initial Game Settings

let orientation = 'x';
let parts       = 10;
let speed       = 1.5;
let cvsWidth    = cvs.getBoundingClientRect().width;
let cvsHeight   = cvs.getBoundingClientRect().height;
let posX        = cvsWidth / 2;
let posY        = cvsHeight / 2;
let size        = (cvsWidth < 700)? 0.2 * cvsWidth : 0.02 * cvsWidth;
let snake       = [];
let d         = 'd';
let xChange     = 10;
let yChange     = 0;
let started     = false;
let food        = [Math.random()*cvsWidth*0.8 , Math.random()*cvsHeight*0.8]
let score       = 0;
let maxScore    = localStorage.getItem('maxScore') || 0;
let interval;
snake.push([posX, posY])
document.getElementById('max-score').innerText = maxScore;
//#endregion

// #region  Helper Functions 
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const displayOptions = () => {
  /* Call pasue/play  to pause */
  clearInterval(interval)
  document.querySelector('.options-menu').classList.toggle('hidden')
}

const resetGame = () => {
  if(started){
    orientation = 'x';
    parts       = 10;
    speed       = 1.5;
    snake       = [];
    score       = 0;
    d         = 'd';
    xChange     = 10;
    yChange     = 0;
    started     = false;
    food        = [Math.random()*cvsWidth*0.8 , Math.random()*cvsHeight*0.8]
    snake.push([posX, posY])
    clearInterval(interval);
    draw()
  }
}

//FIX BLURRY CANVAS ISSUE
let dpi = window.devicePixelRatio;
function fix_dpi() {
  let style_height = +getComputedStyle(cvs).getPropertyValue("height").slice(0, -2);
  let style_width = +getComputedStyle(cvs).getPropertyValue("width").slice(0, -2);

  cvs.setAttribute('height', style_height * dpi);
  cvs.setAttribute('width', style_width * dpi);
}


//#endregion

// #region Collision Handling 

const eatSelf = point =>{
 for(let i = 1; i < snake.length; i++){
  if((point[0] == snake[i][0] && point[1] == snake[i][1] )){
    return true
  }
 }
 return false
}

const hitWall = point => {
  if(
    point[0] >= cvsWidth + 10  ||
    point[1] >= cvsHeight + 10|| 
    point[0] < -30 || 
    point[1] < -20
  ){
    return true
  }
  
  return false
}

const eatFood = point => {  
  const dist = Math.sqrt(Math.pow(point[0] - food[0], 2) + Math.pow(point[1] - food[1], 2))
  return ( dist <= 25 )
}

const checkState =async newPoint => {
  if(hitWall(newPoint) || eatSelf(newPoint)){
    clearInterval(interval)
    alert('You Lost')
    document.getElementById('normal-score').innerText = 0
    if(score > maxScore){
      localStorage.setItem('maxScore', score);
    }
  }
  if(eatFood(newPoint)){
    score++;
    if(score > maxScore){
      document.getElementById('max-score').innerText = score;
    }
    food = [Math.random()*cvsWidth*0.8 , Math.random()*cvsHeight*0.8]
    document.getElementById('normal-score').innerText = score;
    console.log(score)
  }
  else{
    snake.pop();
  }
}

//#endregion

// #region Movment Handler

const changeDirection = dParam => {
  d = dParam 
}

//#endregion

// #region Main drawing functions

const drawSnake = () => {
  for(let i = 0 ;i < snake.length; i++){
    let x = snake[i][0]
    let y = snake[i][1];

    ctx.strokeStyle = (i === 0)? 'white':'green';
    ctx.lineWidth = 3;
    ctx.fillStyle = "chartreuse";
    ctx.strokeRect(x, y, size, size);
    ctx.fillRect(x, y, size, size);
  }
}

const drawFood = () => {
  ctx.strokeStyle = "pink";
  ctx.lineWidth = 2;
  ctx.fillStyle = "crimson";
  ctx.beginPath();
  ctx.arc(food[0], food[1], size / 2, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
}

const draw = () => {
  ctx.clearRect(0, 0, cvsWidth, cvsHeight);
  drawSnake();
  drawFood();

  let oldHeadX = snake[0][0],
      oldHeadY = snake[0][1];
  
  if( d == "a") oldHeadX -= size;
  if( d == "w") oldHeadY -= size;
  if( d == "d") oldHeadX += size;
  if( d == "s") oldHeadY += size;

  checkState([oldHeadX, oldHeadY]);
  snake.unshift([oldHeadX, oldHeadY])

}

const startGame = () => {

  let renderSpeed = 50 * speed;
  if(!started){
    interval = setInterval(() => {
      draw();
    }, 100)
    started = true;
  }

}

const toggleGameState = () => {
  if(started){
    clearInterval(interval);
    started = false;
  }
  else{
    startGame();
  }
}

//#endregion


options.addEventListener('click', displayOptions)
reset.addEventListener('click',async () => {
  resetGame();
  await sleep(500);
  startGame();
})
toggle.addEventListener('click', toggleGameState);
exitOptionsMenu.addEventListener('click', () => document.querySelector('.options-menu').classList.add('hidden'))

//Called one time to display initial game state
fix_dpi();
draw();
