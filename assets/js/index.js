window.onload = () => {

  setInterval(() => {
    document.getElementById('snake-logo').classList.toggle('shake-bottom')
  }, 3000)


  /* Key press handler */

  window.addEventListener('keydown', e => {

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
      


      default:
        console.log(e.code);
        break;
    }
  })

}




const exitOptionsMenu = document.getElementById('close-options-menu');
const reset           = document.getElementById('reset');
const toggle          = document.getElementById('toggle');
const options         = document.getElementById('options');
const board           = document.getElementById('main');
const svgns           = "http://www.w3.org/2000/svg";


/* Game initial status */

let orientation = 'x';
let parts       = 5;
let speed       = 3;
let posX        = board.clientWidth / 2;
let posY        = board.clientHeight / 2;
let size        = 0.02 * board.clientWidth;
let points      = [];
let key         = 'd';
let xChange     = 10;
let yChange     = 0;
let started     = false;
let interval;

/* =================== */

const displayOptions = () => {
  /* Call pasue/play  to pause */
  
  document.querySelector('.options-menu').classList.toggle('hidden')
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

const move = async key => {
  
  if(orientation === 'x'){
    if(key === 'w'){
      orientation = 'y'
      xChange = 0;
      yChange = -10;
    }
    if(key === 's'){
      orientation = 'y'
      xChange = 0;
      yChange = 10;
    }
  }
  else{
    if(key === 'a'){
      orientation = 'x'
      xChange = -10;
      yChange = 0;
    }
    if(key === 'd'){
      orientation = 'x'
      xChange = 10;
      yChange = 0;
    }
  }

  const len = points.length;
  const newPoint = [points[0][0] + xChange, points[0][1] + yChange]
  const DOM = document.getElementById('main');
 
  console.log(newPoint, xChange, yChange)
  /* Remove one box from tail */
  points.pop()
  DOM.removeChild(DOM.lastChild)

  /* Add box to the head */
  addPoint(newPoint[0], newPoint[1]) 

}

/* Sleep function to set movment speed */
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

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
  
}

const startGame = () => {
  if(!started){
    interval = setInterval(() => {
      move(key);
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

const changeDirection = keyParam => {
  key = keyParam 
}

options.addEventListener('click', displayOptions)
exitOptionsMenu.addEventListener('click', () => document.querySelector('.options-menu').classList.add('hidden'))





setup()
