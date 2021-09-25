const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ground = new Image();
ground.src = "pole7.png";

ground.style.opacity = '50%';

const foodImg = new Image();
foodImg.src = "apple24.png";

let box = 25;

let score = 0;

let food = {  
  x: Math.floor((Math.random() * 26)) * box,
  y: (Math.floor(Math.random() * 26) + 2) * box
};



let snake = [];
snake[0] = {
  x: 9 * box,
  y: 10 * box
};

document.addEventListener("keydown", direction);

let dir;

function direction(event) {
  if(event.keyCode == 37 && dir != "right")
    dir = "left";
  else if(event.keyCode == 38 && dir != "down")
    dir = "up";
  else if(event.keyCode == 39 && dir != "left")
    dir = "right";
  else if(event.keyCode == 40 && dir != "up")
    dir = "down";
}

function eatTail(head, arr) {
  for(let i = 0; i < arr.length; i++) {
    if(head.x == arr[i].x && head.y == arr[i].y){
    clearInterval(game);
      
   gameOver();
    }
  }
}

function drawGame() {
  ctx.drawImage(ground, 0, 0);

  ctx.drawImage(foodImg, food.x, food.y);

  for(let i = 0; i < snake.length; i++) {
    ctx.fillStyle = '#10d130';

    ctx.fillRect(snake[i].x, snake[i].y, box-1, box-1);
  }

  ctx.fillStyle = "white";
  ctx.font = "50px Arial";
  ctx.fillText(score,  25, 40);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if(snakeX == food.x && snakeY == food.y) {
    score++;
	playSound('apple1.mp3'); // запуск ф-ции для воспр-я звука яблока
	
  food = {  
    x: Math.floor((Math.random() * 26)) * box,
    y: (Math.floor(Math.random() * 26) + 2) * box
  };
  } else {
    snake.pop();
  }

  if(snakeX < box * 0 || snakeX > box * 27
    || snakeY < box * 2 || snakeY > box * 27){
   clearInterval(game);
   //подключаем звук удара
   playSound('wall.mp3');
   //выводим окно gameover
   gameOver();
  }

    

  if(dir == "left") snakeX -= box;
  if(dir == "right") snakeX += box;
  if(dir == "up") snakeY -= box;
  if(dir == "down") snakeY += box;


  
  let newHead = {
    x: snakeX,
    y: snakeY
  };

  eatTail(newHead, snake);

  snake.unshift(newHead);
}

let game = setInterval(drawGame,350);

function playSound(soundName) {
	let audio = new Audio(); 
	audio.src = soundName; 
	audio.autoplay = true;
}

function cancel() {
	document.getElementById('gameover').style.display = 'none';
}	

function records() {
	document.getElementById('tablrec').style.display = 'block';

}

function Save(){
  
  document.getElementById('gameover').style.display = 'none';
	//RefreshSCRs();
}

function closeRecords() {
  document.getElementById('tablrec').style.display = 'none';
}

function reset() {
  snake = [];
  snake[0] = {
    x: 9 * box,
    y: 10 * box
  };
  
  food = {  
    x: Math.floor((Math.random() * 26)) * box,
  y: (Math.floor(Math.random() * 26) + 2) * box
  };

  score=0;
  dir="";
  game = setInterval(drawGame,300);
}	

function gameOver() {
  document.getElementById('gameover').style.display = 'inline';
  document.getElementById('gameover').style.animation= '5s infinite';
  playSound('gameover1.mp3');
  window.navigator.vibrate(200); 
  
 
  
  // let end=document.getElementsByClassName('gameover');
  // end.style.position='absolute';
  // end.style.visibility='hidden';
  // end.style.display = 'block'
  // end.style.height='auto';
  // var targetHeight=end.offsetHeight;
  // console.log(targetHeight);
  
  // end.style.height='0px';
  // end.style.position='';
  // end.style.visibility='';
  
  // setTimeout(function() { end.style.height=targetHeight+"px"; }, 0);*/
}



window.onload = function () { 
  confirm("Перезагрузить страницу?\nВозможно, внесённые данные не сохранятся.");}