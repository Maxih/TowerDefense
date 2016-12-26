import Projectile from "./projectile";

export default class Tower {
  constructor(size, update, createProjectile) {
    this.size = size;
    this.active = false;
    this.valid = false;
    this.radius = 175;

    this.rof = 1000;
    this.lastShot = 0;

    this.elements = new createjs.Container();

    const ghost = new createjs.Shape();
    ghost.name = "ghost";
    ghost.regX = 15;
    ghost.regY = 15;

    const radius = new createjs.Shape();
    radius.name = "radius";
    radius.regX = 15;
    radius.regY = 15;

    this.elements.mouseChildren = false;

    this.elements.on("mouseover", this.revealRadius.bind(this));
    this.elements.on("mouseout", this.hideRadius.bind(this));

    this.update = update;

    this.elements.addChild(ghost, radius);
    this.createProjectile = createProjectile;
    // this.drawTurret();
  }

  getTower() {
    return this.elements.getChildByName("tower");
  }

  towerSprite() {
    const data = {
      images: ['./assets/tower.png'],
      frames: {width: 30, height: 30}
    };
    const spriteSheet = new createjs.SpriteSheet(data);
    const tower = new createjs.Sprite(spriteSheet);

    return tower;
  }

  turretSprite() {
    const data = {
      images: ['./assets/turret.png'],
      frames: {width: 30, height: 30}
    };
    const spriteSheet = new createjs.SpriteSheet(data);
    const turret = new createjs.Sprite(spriteSheet);

    // turret.x = -15;
    // turret.y = -25;

    return turret;
  }

  drawValidTower() {
    let tower = this.elements.getChildByName("ghost");

    tower.graphics.clear().beginFill("#76c476").beginStroke("#3e8a3e").setStrokeStyle(1).drawRect(0, 0, 30, 30).endStroke().endFill();


    this.update();
  }

  drawInValidTower() {
    let tower = this.elements.getChildByName("ghost");

    tower.graphics.clear().beginFill("#b13f3f").beginStroke("#c47676").setStrokeStyle(1).drawRect(0, 0, 30, 30).endStroke().endFill();

    this.update();
  }

  drawTurret() {
    const turret = this.elements.getChildByName("turret");

    turret.graphics.clear().beginFill("Black").drawRect(this.size/2 - (this.size/3) / 2, this.size/2, this.size/3, this.size).endFill();
  }

  drawRadius() {
    let radius = this.elements.getChildByName("radius");

    radius.graphics.clear().beginStroke("Yellow").setStrokeStyle(3).drawCircle(this.size/2, this.size/2, this.radius).endStroke();
  }

  removeRadius() {
    let radius = this.elements.getChildByName("radius");

    radius.graphics.clear();
  }

  targetMinion(minions) {

    let target = null;

    for(let i = 0; i < minions.length; i++) {
      let minionX = minions[i].elements.x + (15/2);
      let minionY = minions[i].elements.y + (15/2);
      let towerX = this.elements.x + 15;
      let towerY = this.elements.y + 15;
      if(Math.hypot(towerX - minionX, towerY - minionY) < this.radius) {
        target = minions[i];
      }
    }

    if(target !== null) {
      let minionX = target.elements.x + (15/2);
      let minionY = target.elements.y + (15/2);
      this.aimTurret(minionX, minionY);
      let time = new Date().getTime();
      if(this.lastShot + this.rof < time) {
        this.shootTurret(target);
        this.lastShot = time;
      }
    }
  }

  shootTurret(minion) {
    let projectile = new Projectile(minion, 2, 4);
    projectile.elements.x = this.elements.x - 15;
    projectile.elements.y = this.elements.y - 15;
    this.createProjectile(projectile);
  }


  aimTurret(x, y) {
    const turret = this.elements.getChildByName("turret");

    let dX = this.elements.x - x;
    let dY = this.elements.y - y;

    let angle = toDegrees(Math.atan(dY/dX));
    angle += 90;

    if(this.elements.x < x)
      angle = angle + 180;

    turret.rotation = angle
  }

  setPos(x, y) {
    this.elements.x = x;
    this.elements.y = y;
  }

  invalidPosition() {
    if(this.valid) {
      this.drawInValidTower();
      this.drawRadius();
      this.valid = false;
    }
  }

  validPosition() {
    if(!this.valid) {
      this.drawValidTower();
      this.hideRadius();
      this.valid = true;
    }
  }

  revealRadius() {
    this.drawRadius();
    this.update();
  }

  hideRadius() {
    if(this.active) {
      this.removeRadius();
      this.update();
    }
  }

  activate() {
    this.active = true;

    const tower = this.towerSprite();
    const turret = this.turretSprite();

    turret.regX = 15;
    turret.regY = 15;

    tower.regX = this.size / 2;
    tower.regY = this.size / 2;

    tower.name = "tower";
    turret.name = "turret";

    this.elements.addChild(tower, turret);
  }

  intersect(tower) {
    return (this.elements.x < (tower.elements.x + tower.size) &&
          tower.elements.x < (this.elements.x + this.size) &&
          this.elements.y < (tower.elements.y + tower.size) &&
          tower.elements.y < (this.elements.y + this.size))
  }
}

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}
