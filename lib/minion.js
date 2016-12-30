
export default class Minion {
  constructor() {
    this.elements = this.minionSprite();

    this.size = 15;
    this.health = 5000;
    this.speed = 1;
    this.path = {};
    this.vectors = {
      x: 0,
      y: this.speed
    }


  }

  setPath(path) {
    this.path = path;
  }

  moveMinion() {
    let coord = this.fieldToGrid();
    const curPath = this.path.getPathToCoord(coord.x, coord.y, 13, 31);
    // console.log(curPath);
    if(curPath === null || curPath === undefined) {
      return false;
    }

    if(curPath.x !== undefined && curPath.y !== undefined)
      this.adjustVector(curPath);

    this.elements.y += this.vectors.y;
    this.elements.x += this.vectors.x;

    return true;
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


    let targetX = curPath.x * 15 + 7.5;
    let targetY = curPath.y * 15 + 7.5;
    let projX = this.elements.x
    let projY = this.elements.y


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
    let x = this.elements.x;
    x /= 15;

    let y = this.elements.y;
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
