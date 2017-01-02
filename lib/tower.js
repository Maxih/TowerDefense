import GameObject from "./gameobject";
import Projectile from "./projectile";
import merge from "lodash/merge";

const defaults = {
  turretSprite: './assets/turret.png',
  rateOfFire: 1000,
  radius: 50,
  damage: 10,
  numTargets: 0,
  cost: 20,
}

export default class Tower extends GameObject {
  constructor(options = {}, createProjectile) {
    super(merge({}, defaults, options));

    this.active = false;
    this.valid = false;
    this.lastShot = 0;

    this.targets = {};

    this.elements = this.towerContainer();
    this.createProjectile = createProjectile;
    // this.drawTurret();
  }

  getTower() {
    return this.elements.getChildByName("tower");
  }

  towerContainer() {
    const tower = new createjs.Container();

    const ghost = new createjs.Shape();
    ghost.name = "ghost";
    ghost.regX = 15;
    ghost.regY = 15;

    const radius = new createjs.Shape();
    radius.name = "radius";
    radius.regX = 15;
    radius.regY = 15;

    tower.mouseChildren = false;

    tower.on("mouseover", this.revealRadius.bind(this));
    tower.on("mouseout", this.hideRadius.bind(this));

    tower.addChild(ghost, radius);

    return tower;
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
      images: [this.options.turretSprite],
      frames: {width: 30, height: 30}
    };
    const spriteSheet = new createjs.SpriteSheet(data);
    const turret = new createjs.Sprite(spriteSheet);

    return turret;
  }

  drawValidTower() {
    const tower = this.elements.getChildByName("ghost");

    tower.graphics.clear().beginFill("#76c476").beginStroke("#3e8a3e").setStrokeStyle(1).drawRect(0, 0, 30, 30).endStroke().endFill();
  }

  drawInValidTower() {
    const tower = this.elements.getChildByName("ghost");

    tower.graphics.clear().beginFill("#b13f3f").beginStroke("#c47676").setStrokeStyle(1).drawRect(0, 0, 30, 30).endStroke().endFill();
  }

  drawRadius() {
    const radius = this.elements.getChildByName("radius");

    radius.graphics.clear().beginStroke("Yellow").setStrokeStyle(3).drawCircle(this.options.width/2, this.options.height/2, this.options.radius).endStroke();
  }

  removeRadius() {
    const radius = this.elements.getChildByName("radius");

    radius.graphics.clear();
  }

  targetMinion(minions) {
    let towerX = this.elements.x + 15;
    let towerY = this.elements.y + 15;
    const possibleTargets = Object.keys(minions);

    if(this.options.numTargets === 0) {
      const targets = [];
      possibleTargets.forEach((minion) => {
        let minionX = minions[minion].elements.x + (15/2);
        let minionY = minions[minion].elements.y + (15/2);

        if(Math.hypot(towerX - minionX, towerY - minionY) < this.options.radius) {
          targets.push(minions[minion]);
        }
      });
      let time = new Date().getTime();
      if(this.lastShot + this.options.rateOfFire < time) {
        this.groundAttack(targets);
        this.lastShot = time;
      }

      return;
    }

    /* Check old targets to see if they are still in range */
    let oldTargets = Object.keys(this.targets);
    oldTargets.forEach((oldTarget) => {
      let minionX = this.targets[oldTarget].elements.x + (15/2);
      let minionY = this.targets[oldTarget].elements.y + (15/2);
      if(Math.hypot(towerX - minionX, towerY - minionY) > this.options.radius || this.targets[oldTarget].health < 0) {
        // Remove old target if theyve moved out of range
        delete this.targets[oldTarget];
      }
    });

    let curTargeted = Object.keys(this.targets).length;

    possibleTargets.forEach((target) => {
      if(curTargeted < this.options.numTargets) {
        let minionX = minions[target].elements.x + (15/2);
        let minionY = minions[target].elements.y + (15/2);

        if(Math.hypot(towerX - minionX, towerY - minionY) < this.options.radius) {
          if(this.targets[target] === undefined) {
            this.targets[target] = minions[target];
            curTargeted++;
          }
        }
      }
    });

    const aimTarget = Object.values(this.targets);

    if(aimTarget.length > 0) {
      // Aim the turret at a minion
      let minionX = aimTarget[0].elements.x + (15/2);
      let minionY = aimTarget[0].elements.y + (15/2);

      this.aimTurret(minionX, minionY);
      let time = new Date().getTime();
      if(this.lastShot + this.options.rateOfFire < time) {
        this.shootTurret(aimTarget);
        this.lastShot = time;
      }
    }
  }

  groundAttack(minions) {
    if(minions.length === 0)
      return

    const data = {
      images: ['./assets/groundattack.png'],
      frames: {width:100, height:100, count:6, regX: 50, regY:50, spacing:0, margin:0},
      animations: {
        animate: [0, 6, "animate", .5],
      }
    };
    const spriteSheet = new createjs.SpriteSheet(data);
    const explosion = new createjs.Sprite(spriteSheet, "animate");
    explosion.name = "explosion";


    explosion.addEventListener("animationend", this.removeExplosion.bind(this));
    this.elements.addChild(explosion);
    this.elements.setChildIndex(explosion, 0);

    minions.forEach((minion) => {
      minion.health -= this.options.damage;
    });
  }

  removeExplosion() {
    const explosion = this.elements.getChildByName("explosion");
    this.elements.removeChild(explosion);
  }

  shootTurret(minions) {
    minions.forEach((minion) => {
      let projectile = new Projectile(minion, this.options.damage, 5);
      projectile.elements.x = this.elements.x;
      projectile.elements.y = this.elements.y;
      this.createProjectile(projectile);
    })
  }

  aimTurret(x, y) {
    const turret = this.elements.getChildByName("turret");

    const targetCoord = {
      x: x,
      y: y
    };

    turret.rotation = this.getAngleTo(targetCoord) - 90;
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
  }

  hideRadius() {
    if(this.active) {
      this.removeRadius();
    }
  }

  activate() {
    this.active = true;

    const tower = this.towerSprite();
    const turret = this.turretSprite();

    turret.regX = 15;
    turret.regY = 15;

    tower.regX = this.options.width / 2;
    tower.regY = this.options.height / 2;

    tower.name = "tower";
    turret.name = "turret";

    this.elements.addChild(tower, turret);

    const ghost = this.elements.getChildByName("ghost");
    ghost.graphics.clear();
  }
}
