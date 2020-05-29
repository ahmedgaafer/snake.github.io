window.onload = () => {

  document.getElementById('max-score').innerText = localStorage.getItem('snake-score-max') || 0;
  setInterval(() => {
    document.getElementById('snake-logo').classList.toggle('shake-bottom')
  }, 3000)

  // #region Key Press Handler 
  window.addEventListener('keydown', async e => {

    switch (e.code){
      case 'KeyQ':
        addPoint(points[points.length - 1][0] - size, points[points.length - 1][1], true);
        break;
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
        changeDirection('w');
        break;
      case 'KeyS':
        changeDirection('s');
        break;
      case 'KeyD':
        changeDirection('d');
        break;
      case 'KeyA':
        changeDirection('a');
        break;
      case 'ArrowUp':
        changeDirection('w');
        break;
      case 'ArrowDown':
        changeDirection('s');
        break;
      case 'ArrowRight':
        changeDirection('d');
        break;
      case 'ArrowLeft':
        changeDirection('a');
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
const board           = document.getElementById('main');
const svgns           = "http://www.w3.org/2000/svg";


// #region Initial Game Settings

let orientation = 'x';
let parts       = 10;
let speed       = 1.5;
let posX        = board.clientWidth / 2;
let posY        = board.clientHeight / 2;
let size        = 0.02 * board.clientWidth;
let points      = [];
let key         = 'd';
let xChange     = 10;
let yChange     = 0;
let started     = false;
let interval;
let food        =[Math.random()*board.clientWidth + 10 , Math.random()*board.clientHeight + 10]

//#endregion

// #region  Helper Functions 
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const displayOptions = () => {
  /* Call pasue/play  to pause */
  clearInterval(interval)
  document.querySelector('.options-menu').classList.toggle('hidden')
}

const resetGame = () => {
   orientation = 'x';
   parts       = 10;
   posX        = board.clientWidth / 2;
   posY        = board.clientHeight / 2;
   size        = 0.02 * board.clientWidth;
   points      = [];
   key         = 'd';
   xChange     = 10;
   yChange     = 0;
   started     = false;
   food        = [Math.random()*board.clientWidth + 10 , Math.random()*board.clientHeight + 10]
   clearInterval(interval);
   const DOM = document.getElementById('main');
   while(DOM.firstChild)DOM.removeChild(DOM.firstChild)
   setup()

}
//#endregion

// #region Collision Handling 

const eatSelf = point =>{
 for(let i = 1; i < points.length; i++){
  if((point[0] == points[i][0] && point[1] == points[i][1] )){
    return true
  }
 }
 return false
}

const hitWall = point => {
  if(
    point[0] >= board.clientWidth - 10 ||
    point[1] >= board.clientHeight - 10 || 
    point[0] < -10 || 
    point[1] < -10
  ){
    return true
  }
  
  return false
}

const eatFood = point => {  
  const margin = 10
  return ( (Math.abs(point[0] - food[0] < margin)) && (Math.abs(point[1] - food[1] < margin)) )
}

const checkState =async newPoint =>{
  if(hitWall(newPoint) || eatSelf(newPoint)){
    clearInterval(interval)
    alert('You Lost')
    let score = Number(document.getElementById('normal-score').innerText)
    if(localStorage.getItem('snake-score-max') && localStorage.getItem('snake-score-max') < score){
      localStorage.setItem('snake-score-max', score)
      document.getElementById('max-score').innerText = score;
    }
    document.getElementById('normal-score').innerText = 0
  }
  if(eatFood(newPoint)){
    document.getElementById('food').remove()
    food =[Math.random()*board.clientWidth + 10 , Math.random()*board.clientHeight + 10]
    let foodDOM = document.createElementNS(svgns, 'rect');
      foodDOM.setAttribute('x', food[0]);
      foodDOM.setAttribute('y', food[1]);
      foodDOM.setAttribute('height', `${size}`);
      foodDOM.setAttribute('width', `${size}`);
      foodDOM.style.fill="crimson"
      foodDOM.setAttribute('id', 'food')
    board.appendChild(foodDOM)
    addPoint(points[points.length-1][0], points[points.length-1][1], true)
    document.getElementById('normal-score').innerText = Number(document.getElementById('normal-score').innerText) + 1
    console.log(document.getElementById('normal-score').innerText)
  }
}

//#endregion

// #region Movment Handler
const move = async key => {
  const dist = 13
  if(orientation === 'x'){
    if(key === 'w'){
      orientation = 'y'
      xChange = 0;
      yChange = -dist;
    }
    if(key === 's'){
      orientation = 'y'
      xChange = 0;
      yChange = dist;
    }
  }
  else{
    if(key === 'a'){
      orientation = 'x'
      xChange = -dist;
      yChange = 0;
    }
    if(key === 'd'){
      orientation = 'x'
      xChange = dist;
      yChange = 0;
    }
  }

  const newPoint = [points[0][0] + xChange, points[0][1] + yChange]
  checkState(newPoint)

  const DOM = document.getElementById('main');
 

  /* Add box to the head */
  addPoint(newPoint[0], newPoint[1]) 
  
  /* Remove one box from tail */
  if(DOM.firstChild.id === 'food'){
    DOM.appendChild(DOM.firstChild)
  }
  points.pop()
  DOM.removeChild(DOM.firstChild)
}

const addPoint = (newX, newY, last=false) => {
  let rect = document.createElementNS(svgns, 'rect');
        rect.setAttribute('x', newX);
        rect.setAttribute('y', newY);
        rect.setAttribute('height', `${size}`);
        rect.setAttribute('width', `${size}`);
        rect.style.fill="#7FFF00";
        (last)?points.push([newX, newY]):points.unshift([newX, newY])       
    board.appendChild(rect);
}

const changeDirection = keyParam => {
  key = keyParam 
}

//#endregion

// #region Main functions
const setup = () => {

  for(let i = 0 ;i < parts; i++){
    let rect = document.createElementNS(svgns, 'rect');
        rect.setAttribute('x', posX - (size * i));
        rect.setAttribute('y', posY);
        rect.setAttribute('height', `${size}`);
        rect.setAttribute('width', `${size}`);
        rect.setAttribute('id', `block${i}`)
        rect.style.fill="#7FFF00"
        points.push([posX - (size * i), posY])       
    board.appendChild(rect)
  }
  let foodDOM = document.createElementNS(svgns, 'rect');
      foodDOM.setAttribute('x', food[0]);
      foodDOM.setAttribute('y', food[1]);
      foodDOM.setAttribute('height', `${size}`);
      foodDOM.setAttribute('width', `${size}`);
      foodDOM.style.fill="crimson"
      foodDOM.setAttribute('id', 'food')
  board.appendChild(foodDOM)
  
}

const startGame = () => {

  let renderSpeed = 50 * speed;
  const DOM = document.getElementById('main');
  if(!started){
    interval = setInterval(() => {
      move(key);
    }, renderSpeed)
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
exitOptionsMenu.addEventListener('click', () => document.querySelector('.options-menu').classList.add('hidden'))




//Called one time to display initial game state
setup()
