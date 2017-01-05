import GameObject from "./gameobject";
import merge from "lodash/merge";

const defaults = {
  minionSprite: './assets/minion.png',
  speed: 1,
  health: 100,
  reward: 10,
  height: 15,
  width: 15,
  speedMult: 2,
}

export default class Minion extends GameObject {
  constructor(options = {}) {
    super(merge({}, defaults, options));

    this.elements = this.minionSprite();

    this.health = this.options.health;
    this.baseHealth = this.options.health;
    this.speed = this.options.speed;
    this.targetCoord = null;

    this.speedDelay = 1500;

    this.lastVector = {};
    this.lastVectorChange = 0;

    this.lastAngle = 0;
    this.lastAngleChange = 0;
    this.path = {};

    this.slowEffects = null;

    this.drawHealth();
  }

  moveMinion(x, y) {

    let target;

    if(this.path.updated || !this.targetCoord){
      this.targetCoord = this.path.getPathToCoord(x, y, 15, 31);
    }

    if(!this.targetCoord)
      return false;

    if((this.targetCoord.x === x && this.targetCoord.y === y) || y < 1) {
      this.targetCoord = this.path.getPathToCoord(x, y, 15, 31);
      // console.log(this.targetCoord);

    }


    if(!this.targetCoord)
      return false;

    target = this.targetCoord;


    const targetCoord = {
      x: target.x * 15 + 7.5,
      y: target.y * 15 + 7.5
    }

    const angle = this.getAngleTo(targetCoord);
    const vector = this.getVectorOf(angle);

    let speed = this.speed;
    let time = new Date().getTime();

    let speedRatio = this.speed + ((time - this.lastAngleChange) / this.speedDelay) * this.options.speedMult;

    if(speedRatio < this.options.speedMult + this.speed) {
      speed *= speedRatio;
    } else {
      speed *= this.options.speedMult + this.speed;
    }

    const angleChange = Math.abs(this.lastAngle - angle);


    if(angleChange > 45) {
      this.lastAngleChange = time;
    }

    this.lastAngle = angle;

    if(this.slowEffects !== null) {
      if(this.slowEffects.length > time) {
        speed *= this.slowEffects.mult;
      } else {
        this.removeSlow();
      }
    }

    this.elements.rotation = angle - 90;

    this.elements.y += vector.y * speed;
    this.elements.x += vector.x * speed;

    return true;
  }

  drawHealth() {
    let healthPercent = this.health / this.baseHealth;
    let healthAngle = healthPercent * 2 * Math.PI;
    const healthCircle = this.elements.getChildByName("health");

    healthCircle.graphics.clear().beginFill("Green").arc(0,0,9,0,healthAngle).closePath();
    healthCircle.regX = -7.5;
    healthCircle.regY = -7.5;

    this.elements.setChildIndex(healthCircle, 1);
  }

  damageMinion(damage) {
    this.health -= damage;

    this.drawHealth();

    return this.health;
  }

  slowMinion(mult, length, chance) {
    let num = Math.random();
    if(num <= chance) {
      const slowCircle = new createjs.Shape();

      this.slowEffects = {
        length: new Date().getTime() + length,
        mult: mult,
        circle: slowCircle,
      };

      slowCircle.graphics.beginFill("LightBlue").drawCircle(0, 0, 10).endFill();

      slowCircle.regX = -7.5;
      slowCircle.regY = -7.5;

      this.elements.addChild(slowCircle);
      this.elements.setChildIndex(slowCircle, 0);

    }
  }

  removeSlow() {
    if(this.slowEffects) {
      this.elements.removeChild(this.slowEffects.circle);
      this.slowEffects = null;
    }
  }


  minionSprite() {
    const data = {
      images: ['./assets/minion.png'],
      frames: {width: 15, height: 15}
    };
    const spriteSheet = new createjs.SpriteSheet(data);
    const minion = new createjs.Sprite(spriteSheet);


    const minionContainer = new createjs.Container();
    const healthCircle = new createjs.Shape();
    const redCircle = new createjs.Shape();

    redCircle.graphics.beginFill("Red").drawCircle(0, 0, 9).endFill();


    healthCircle.name = "health";

    redCircle.regX = -7.5;
    redCircle.regY = -7.5;
    minionContainer.regX = 15 / 2;
    minionContainer.regY = 15 / 2;

    minionContainer.addChild(minion, healthCircle, redCircle);
    minionContainer.setChildIndex(redCircle, 0);

    return minionContainer;
  }
}
