(() => {
  //stub
  console.log('game stuff ready');

  //set up variables here
  const theCanvas = document.querySelector('canvas'),
    ctx = theCanvas.getContext('2d'),
    playerImg = document.querySelector('.ship'),
    player = { x: 275, y: 550, width: 50, height: 50, speed: 10, lives: 3},
    bullets = [],
    squares = [
      { x: 30, y: 30, x2: 30, y2: 30, color: 'rgba(0, 200, 0, 0.8)', xspeed: 3, yspeed: 8},
      { x: 60, y: 30, x2: 40, y2: 40, color: 'rgba(200, 0, 0, 0.8)', xspeed: 7, yspeed: 8},
      { x: 90, y: 30, x2: 35, y2: 35, color: 'rgba(0, 0, 200, 0.8)', xspeed: 5, yspeed: 8},
    ],
    playButton = document.querySelector('.play'),
    pauseButton = document.querySelector('.pause');

    var playState = true;

  function draw() {
    ctx.clearRect(0,0, theCanvas.width, theCanvas.height);
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    bullets.forEach((bullet, index) => {
      ctx.fillStyle = 'rgba(200, 0, 0, 0.85)';
      ctx.fillRect(bullet.x, bullet.y, bullet.x2, bullet.y2);

      let bulletIndex = index;

    squares.forEach((square, index) => {
        //check for collision (bullet and box) => check all coordinates and dimensions to see if a bullet is touching a box
        if (bullet.y <= (square.y + square.y2) && bullet.y > square.y && bullet.x > square.x && bullet.x < (square.x + square.x2)){
          delete squares[index];
          delete bullets[bulletIndex];

          //play explosion sound
          let explode = document.createElement('audio');
          explode.src = "audio/explosion.mp3";

          document.body.appendChild(explode);

          explode.addEventListener('ended', () => {
            document.body.removeChild(explode);
          });

          explode.play();
        }
      });

      bullet.y -= bullet.speed;

      //bullet is out of the playing area, delete it now
      if (bullet.y < 0) {
        delete bullets[index];
      }
    });

    squares.forEach(square => {
      ctx.fillStyle = square.color;
      ctx.fillRect(square.x, square.y, square.x2, square.y2);

      if (square.x + square.x2 > theCanvas.width) {
        square.xspeed *= -1;
      } else if (square.x < 0) {
        square.xspeed *= -1;
      }

      if (square.y + square.y2 > theCanvas.height) {
        square.yspeed *= -1;
      } else if (square.y < 0) {
        square.yspeed *= -1;
      }

      square.x += square.xspeed;
      square.y += square.yspeed;
    });

    if (playState === false) {
      window.cancelAnimationFrame(draw);
      return;
    }

    window.requestAnimationFrame(draw);
  }

  // function moveShip(e) {
  //   //check the keycode of the key you're pressing
  //   switch (e.keyCode) {
  //     //left arrow key
  //     case 37:
  //     console.log('move the ship left');
  //     if (player.x > 0){
  //       player.x -= player.speed; //move the ship left
  //     }
  //     break;
  //
  //     case 39:
  //     //right arrow key
  //     console.log('move the ship right');
  //     if (player.x + player.width < theCanvas.width) {
  //       player.x += player.speed; //move the ship right
  //     }
  //     break;
  //
  //     default:
  //     //do nothing
  //   }
  // }

  function createBullet() {
    //create a bullet and push it into the bullet array
    let newBullet = {
      x : player.x + player.width / 2 - 2.5,
      y : theCanvas.height - player.height - 10,
      x2 : 5,//bullet is this many pixels wide
      y2 : 10,//bullet is this many pixels tall
      speed : 12//the speed of the bullet
    };

    bullets.push(newBullet);

    //play laser sound
    let laser = document.createElement('audio');
    laser.src = "audio/laser.mp3";
    document.body.appendChild(laser);

    laser.addEventListener('ended', () => {
      document.body.removeChild(laser);
    });

    laser.play();
  }

  function movePlayer(e) {
    player.x = e.clientX - theCanvas.offsetLeft;
  }

  function resumeGame() {
    playState = true;
    window.requestAnimationFrame(draw);
  }

  function pauseGame() {
    playState = false;
  }

  window.requestAnimationFrame(draw);

  //window.addEventListener('keydown', moveShip);
  //move the player with the mouse instead
  theCanvas.addEventListener('mousemove', movePlayer);
  theCanvas.addEventListener('click', createBullet);

  playButton.addEventListener('click', resumeGame);
  pauseButton.addEventListener('click', pauseGame);
})();
