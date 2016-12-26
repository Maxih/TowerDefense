export default class Projectile {
  constructor(target, damage, speed) {
    this.target = target;
    this.damage = damage;
    this.speed = speed;

    this.radius = 5

    this.elements = this.generateProjectile();
  }

  generateProjectile() {
    let projectile = new createjs.Shape();
    projectile.regX = -15;
    projectile.regY = -15;
    projectile.graphics.beginFill("Red").drawCircle(0, 0, this.radius).endFill();
    return projectile;
  }

  deleteProjectile() {
    this.elements.graphics.clear();
  }

  adjustVector() {
    let angle = this.getAngle();
    let rads = toRadians(angle);

    this.elements.y += this.speed * Math.sin(rads);
    this.elements.x += this.speed * Math.cos(rads);

    let targetX = this.target.elements.x
    let targetY = this.target.elements.y
    let projX = this.elements.x + 15
    let projY = this.elements.y + 15

    let distance = Math.hypot(targetX - projX, targetY - projY);

    if(distance < this.radius) {
      this.target.health -= this.damage;
      return true;
    }


    return false;
  }

  getAngle() {
    let targetX = this.target.elements.x
    let targetY = this.target.elements.y
    let projX = this.elements.x + 15
    let projY = this.elements.y + 15
    let dX = targetX - projX;
    let dY = targetY - projY;

    let angle = toDegrees(Math.atan(dY/dX));

    if(projX > targetX)
      angle = angle + 180;

    return angle;
  }

}
function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

function toRadians (angle) {
 return angle * (Math.PI / 180);
}
