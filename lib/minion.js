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
    this.path = {};

    this.speedDelay = 1500;

    this.lastVector = {};
    this.lastVectorChange = 0;

    this.slowEffects = null;

    this.drawHealth();
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

    let speed = this.speed;
    let time = new Date().getTime();

    let speedRatio = this.speed + ((time - this.lastVectorChange) / this.speedDelay) * this.options.speedMult;

    if(speedRatio < this.options.speedMult + this.speed) {
      speed *= speedRatio;
    } else {
      speed *= this.options.speedMult + this.speed;
    }

    let roundedX = vector.x.toFixed(2);
    let roundedY = vector.y.toFixed(2);

    if(this.lastVector.x !== roundedX && this.lastVector.y !== roundedY) {
      this.lastVectorChange = time;
    }

    this.lastVector = {
      x:roundedX,
      y:roundedY
    };

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
      console.log("minionFrozen");
      this.slowEffects = {
        length: new Date().getTime() + length,
        mult: mult
      };
      const slowCircle = new createjs.Shape();

      slowCircle.graphics.beginFill("LightBlue").drawCircle(0, 0, 10).endFill();
      slowCircle.name = "slow-circle";

      slowCircle.regX = -7.5;
      slowCircle.regY = -7.5;

      this.elements.addChild(slowCircle);
      this.elements.setChildIndex(slowCircle, 0);

    }
  }

  removeSlow() {
    this.slowEffects = null;

    const slowCircle = this.elements.getChildByName("slow-circle");

    if(slowCircle)
      this.elements.removeChild(slowCircle);
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
