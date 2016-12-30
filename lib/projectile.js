import GameObject from "./gameobject";

export default class Projectile extends GameObject {
  constructor(target, damage, speed) {
    super({width: 10, height: 10});

    this.target = target;
    this.damage = damage;
    this.speed = speed;
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
      images: ['./assets/explosion.png'],
      frames: {width:32, height:32, count:16, regX: 16, regY:16, spacing:0, margin:0},
      animations: {
        animate: [0, 15, "animate", .5],
      }
    };
    const spriteSheet = new createjs.SpriteSheet(data);
    const explosion = new createjs.Sprite(spriteSheet, "animate");


    explosion.addEventListener("animationend", callback);

    return explosion;
  }

  projectileSprite() {
    const data = {
      images: ['./assets/plasmabullet.png'],
      frames: {width:10, height:10},
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
      x: this.target.elements.x,
      y: this.target.elements.y
    }

    const angle = this.getAngleTo(targetCoord);
    const vector = this.getVectorOf(angle);

    this.elements.rotation = angle - 90;

    this.elements.y += vector.y * this.speed;
    this.elements.x += vector.x * this.speed;

    if(this.intersects(this.target)) {
      this.target.health -= this.damage;
      return true;
    }

    return false;
  }

}
