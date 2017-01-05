import GameObject from "./gameobject";
import merge from "lodash/merge";

const defaults = {
  sprite: './assets/plasma2.png',
  explosionSprite: './assets/plasmaexplosion.png',
  target: {},
  speed: 1,
  damage: 10,
  animation: "bullet",
  width: 10,
  height: 10
}

export default class Projectile extends GameObject {
  constructor(options = {}) {
    super(merge({}, defaults, options));

    this.active = true;

    this.elements = this.projectileSprite();
  }

  beginRemove(callback) {
    this.active = false;
    this.elements.removeAllChildren();
    this.elements.addChild(this.explosionSprite(callback));
  }

  endRemove(callback) {
    callback();
  }


  explosionSprite(callback) {
    const data = {
      images: [this.options.explosionSprite],
      frames: {width:30, height:30, count:14, regX: 15, regY:15, spacing:0, margin:0},
      animations: {
        animate: [0, 14, "animate", .5],
      }
    };
    const spriteSheet = new createjs.SpriteSheet(data);
    const explosion = new createjs.Sprite(spriteSheet, "animate");

    const targetCoord = {
      x: this.options.target.elements.x,
      y: this.options.target.elements.y
    }

    const angle = this.getAngleTo(targetCoord);

    explosion.rotation = angle;

    explosion.addEventListener("animationend", callback);

    return explosion;
  }

  projectileSprite() {
    const data = {
      images: [this.options.sprite],
      frames: {width:10, height:20},
    };
    const spriteSheet = new createjs.SpriteSheet(data);
    const projectile = new createjs.Sprite(spriteSheet);

    projectile.regX = 5;
    projectile.regY = 5;

    const projectileContainer = new createjs.Container();
    projectileContainer.addChild(projectile);

    return projectileContainer;
  }

  moveProjectile() {

    if(!this.active)
      return false;

    const targetCoord = {
      x: this.options.target.elements.x,
      y: this.options.target.elements.y
    }

    const angle = this.getAngleTo(targetCoord);
    const vector = this.getVectorOf(angle);

    this.elements.rotation = angle - 90;

    this.elements.y += vector.y * this.options.speed;
    this.elements.x += vector.x * this.options.speed;

    if(this.intersects(this.options.target)) {
      this.options.target.damageMinion(this.options.damage);
      return true;
    }

    return false;
  }

}
