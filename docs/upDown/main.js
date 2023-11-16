title = "up down";

description = `
hold to stop
click to turn
`;

characters = [
  `
ll  ll
llllll
ll l l
ll l l
llllll
 l  l
 l  l
    
`,

  ` 
l  l
 ll
 ll
l  l
`,
  `
  g
 g g
g   g

`,
  `
r   r
 r r
  r
`,
  `


 
`,
];

// Game design variable container
const G = {
  WIDTH: 100,
  HEIGHT: 150,
  MOVE_SPEED: 0.5,

  ENEMY_SPEED: 0.3,
};

// Game runtime options
// Refer to the official documentation for all available options
options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  isCapturing: true,
  //isCapturingGameCanvasOnly: true,
  isReplayEnabled: true,
};

// JSDoc comments for typing

/**
 * @typedef {{
 * pos: Vector,
 * row: Number,
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector
 * type: string
 * }} Enemy
 */

/**
 * @type { Enemy [] }
 */
let enemies;

let count;
let trapnum;
let rand;
let set;
let scount;
let playerSpeed;
let enemySpeed;
let isMoving;

let row = [37, 57, 77, 97, 117, 137];

function update() {
  if (!ticks) {
    enemySpeed = G.ENEMY_SPEED;
    isMoving = true;
    playerSpeed = G.MOVE_SPEED;

    player = {
      pos: vec(G.WIDTH / 2, row[3]),
      row: 3,
    };

    enemies = [];
  }

  drawFloor();
  addScore(1 / 60);

  speedUp();
  console.log(enemies);
  if (enemies.length === 0) {
    console.log("I ADD");
    for (let i = 0; i < 7; i++) {
      const piece = Math.random() * 3 + 1;

      switch (Math.floor(piece)) {
        case 1:
          enemies.push(
            {
              pos: vec(0, 0),
              type: "gap",
            },
            {
              pos: vec(0, 0),
              type: "up",
            },
            {
              pos: vec(0, 0),
              type: "gap",
            }
          );
          break;
        case 2:
          enemies.push(
            {
              pos: vec(0, 0),
              type: "kill",
            },
            {
              pos: vec(0, 0),
              type: "kill",
            },
            {
              pos: vec(0, 0),
              type: "kill",
            }
          );
          break;
        case 3:
          enemies.push(
            {
              pos: vec(0, 0),
              type: "kill",
            },
            {
              pos: vec(0, 0),
              type: "down",
            },
            {
              pos: vec(0, 0),
              type: "kill",
            }
          );
          break;
      }
    }
  }

  if (player.pos.x == G.WIDTH - 2) {
    playerSpeed *= -1;
  } else if (player.pos.x == +2) {
    playerSpeed *= -1;
  }

  if (input.isJustPressed) {
    playerSpeed *= -1;
  }

  if (input.isPressed) {
    isMoving = false;
  }

  if (input.isJustReleased) {
    isMoving = true;
  }

  if (isMoving) {
    player.pos.x += playerSpeed;
  }

  color("black");
  player.pos.y = row[player.row];
  char("a", player.pos);

  remove(enemies, (e, index) => {
    e.pos.x = index * 6 + 2;
    e.pos.y += enemySpeed;
    let sprite;
    switch (e.type) {
      case "kill":
        sprite = "b";
        break;
      case "up":
        sprite = "c";
        break;
      case "down":
        sprite = "d";
        break;
      case "gap":
        sprite = "e";
        break;
    }
    const collider = char(sprite, e.pos).isColliding.char.a;

    if (collider) {
      console.log("collided");
      switch (sprite) {
        case "c":
          movePlayerUp();
          break;
        case "d":
          movePlayerDown();
          break;
        case "b":
          end();
          break;
        case "e":
          break;
        default:
          break;
      }
    }

    return e.pos.y > G.HEIGHT;
  });
}

function drawFloor() {
  for (let i = 40; i < G.HEIGHT; i += 20) {
    color("light_purple");
    rect(0, i, G.WIDTH, 5);
    color("black");
  }
  rect(0, 140, G.WIDTH);
}

function movePlayerUp() {
  if (player.row != 0) {
    player.row -= 1;
  }
}

function movePlayerDown() {
  if (player.row != row.length - 1) {
    player.row += 1;
  }
}

function speedUp() {
  enemySpeed = Math.floor(score / 10) * 0.1 + G.ENEMY_SPEED;
}
