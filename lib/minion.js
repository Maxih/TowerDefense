
export default class Minion {
  constructor() {
    this.elements = this.minionSprite();


    this.health = 5000;
    this.speed = 1;
    this.path = {};
    this.vectors = {
      x: 0,
      y: this.speed
    }
  }

  killMinion() {
  }

  removeMinion() {

  }

  setPath(path) {
    this.path = path;
  }

  moveMinion() {
    let coord = this.fieldToGrid();
    const curPath = this.path.getPathToCoord(coord.x, coord.y, 13, 27);

    if(curPath === null) {
      console.log("reached the end");
      return;
    }

    if(curPath.x !== undefined && curPath.y !== undefined)
      this.adjustVector(curPath);

    this.elements.y += this.vectors.y;
    this.elements.x += this.vectors.x;
  }

  adjustVector(curPath) {
    let angle = this.getAngle(curPath);
    let rads = toRadians(angle);

    this.elements.rotation = angle - 90;

    this.vectors.y = this.speed * Math.sin(rads);
    this.vectors.x = this.speed * Math.cos(rads);



    return false;
  }

  getAngle(curPath) {
    if(curPath === undefined)
      return 90;


    let targetX = curPath.x * 15 + 45;
    let targetY = curPath.y * 15 + 45;
    let projX = this.elements.x + 7.5
    let projY = this.elements.y + 7.5

    // console.log(targetX, targetY);

    let dX = targetX - projX;
    let dY = targetY - projY;

    let angle = toDegrees(Math.atan(dY/dX));

    if(projX > targetX)
      angle = angle + 180;

    return angle;
  }

  minionSprite() {
    const data = {
      images: ['./assets/minion.png'],
      frames: {width: 15, height: 15}
    };
    const spriteSheet = new createjs.SpriteSheet(data);
    const minion = new createjs.Sprite(spriteSheet);

    minion.regX = 15/2;
    minion.regY = 15/2;

    return minion
  }

  fieldToGrid() {
    let x = this.elements.x - 30;
    x /= 15;

    let y = this.elements.y - 30;
    y /= 15;

    return {
      x: Math.floor(x),
      y: Math.floor(y)
    }
  }
}

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

function toRadians (angle) {
 return angle * (Math.PI / 180);
}
