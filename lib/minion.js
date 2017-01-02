import GameObject from "./gameobject";
import merge from "lodash/merge";

const defaults = {
  minionSprite: './assets/minion.png',
  speed: 1,
  health: 100,
  reward: 10,
  height: 15,
  width: 15,
}

export default class Minion extends GameObject {
  constructor(options = {}) {
    super(merge({}, defaults, options));

    this.elements = this.minionSprite();

    this.health = this.options.health;
    this.speed = this.options.speed;
    this.path = {};
  }

  setPath(path) {
    this.path = path;
  }

  moveMinion(target) {


    if(target === null || target === undefined) {
      return false;
    }

    const targetCoord = {
      x: target.x * 15 + 7.5,
      y: target.y * 15 + 7.5
    }

    const angle = this.getAngleTo(targetCoord);
    const vector = this.getVectorOf(angle);

    this.elements.rotation = angle - 90;

    this.elements.y += vector.y * this.speed;
    this.elements.x += vector.x * this.speed;

    return true;
  }


  minionSprite() {
    const data = {
      images: ['./assets/minion.png'],
      frames: {width: 15, height: 15}
    };
    const spriteSheet = new createjs.SpriteSheet(data);
    const minion = new createjs.Sprite(spriteSheet);

    minion.regX = 15 / 2;
    minion.regY = 15 / 2;

    return minion
  }
}
