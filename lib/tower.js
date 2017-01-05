import GameObject from "./gameobject";
import Projectile from "./projectile";
import merge from "lodash/merge";

const defaults = {
  turretSprite: './assets/turret.png',
  levels: {
    1: {
      rateOfFire: 1500,
      radius: 50,
      damage: 5,
      numTargets: 1,
      cost: 5,
      animation: "level-1"
    }
  }
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

    this.level = 1;
    this.revealRadius();

  }

  getTower() {
    return this.elements.getChildByName("tower");
  }

  towerContainer() {
    const towerContainer = new createjs.Container();

    const tower = this.towerSprite();
    const turret = this.turretSprite();
    const levels = this.levelSprite();
    const radius = new createjs.Shape();

    towerContainer.cursor = "pointer";

    turret.regX = this.options.width / 2;
    turret.regY = this.options.height / 2;

    tower.regX = this.options.width / 2;
    tower.regY = this.options.height / 2;

    radius.regX = this.options.width / 2;
    radius.regY = this.options.height / 2;

    levels.x = 4 - (this.options.width / 2);
    levels.y = 0 - (this.options.height / 2);

    tower.name = "tower";
    turret.name = "turret";
    radius.name = "radius";
    levels.name = "levels";


    towerContainer.mouseChildren = false;

    towerContainer.addChild(tower, turret, radius, levels);


    return towerContainer;
  }

  upgrade() {
    let nextLevel = this.options.levels[this.level + 1];

    if(nextLevel) {
      this.level += 1;
      const level = this.elements.getChildByName("levels");
      level.gotoAndPlay(nextLevel.animation);
    }
  }

  towerOptions() {
    return this.options.levels[this.level];
  }

  upgradeCost() {
    let nextLevel = this.options.levels[this.level + 1];

    if(nextLevel)
      return nextLevel.cost;

    return -1;
  }

  levelSprite() {
    const data = {
      images: ['./assets/levels.png'],
      frames: {width:22, height:4, count:4, spacing:0, margin:0},
      animations: {
        "level-1": {
          frames: [0],
        },
        "level-2": {
          frames: [1],
        },
        "level-3": {
          frames: [2],
        },
        "level-4": {
          frames: [3],
        },
      }
    };
    const spriteSheet = new createjs.SpriteSheet(data);
    const level = new createjs.Sprite(spriteSheet, "level-1");

    return level;
  }

  towerSprite() {
    const data = {
      images: ['./assets/tower.png'],
      frames: {width:30, height:30, count:3, spacing:0, margin:0},
      animations: {
        base: {
          frames: [0],
        },
        valid: {
          frames: [1],
        },
        invalid: {
          frames: [2],
        }
      }
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
    const tower = this.elements.getChildByName("tower");
    tower.gotoAndPlay("valid");
  }

  drawInValidTower() {
    const tower = this.elements.getChildByName("tower");
    tower.gotoAndPlay("invalid");
  }

  drawRadius() {
    const radius = this.elements.getChildByName("radius");

    radius.graphics.clear().beginStroke("Yellow").setStrokeStyle(3).drawCircle(this.options.width/2, this.options.height/2, this.options.levels[this.level].radius).endStroke();
  }

  removeRadius() {
    const radius = this.elements.getChildByName("radius");

    radius.graphics.clear();
  }

  targetMinion(minions) {
    let towerX = this.elements.x + 15;
    let towerY = this.elements.y + 15;
    const possibleTargets = Object.keys(minions);

    if(this.options.levels[this.level].numTargets === 0) {
      const targets = [];
      possibleTargets.forEach((minion) => {
        let minionX = minions[minion].elements.x + (15/2);
        let minionY = minions[minion].elements.y + (15/2);

        if(Math.hypot(towerX - minionX, towerY - minionY) < this.options.levels[this.level].radius) {
          targets.push(minions[minion]);
        }
      });
      let time = new Date().getTime();
      if(this.lastShot + this.options.levels[this.level].rateOfFire < time) {
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
      if(Math.hypot(towerX - minionX, towerY - minionY) > this.options.levels[this.level].radius || this.targets[oldTarget].health < 0) {
        // Remove old target if theyve moved out of range
        delete this.targets[oldTarget];
      }
    });

    let curTargeted = Object.keys(this.targets).length;

    possibleTargets.forEach((target) => {
      if(curTargeted < this.options.levels[this.level].numTargets) {
        let minionX = minions[target].elements.x + (15/2);
        let minionY = minions[target].elements.y + (15/2);

        if(Math.hypot(towerX - minionX, towerY - minionY) < this.options.levels[this.level].radius) {
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
      if(this.lastShot + this.options.levels[this.level].rateOfFire < time) {
        this.shootTurret(aimTarget);
        this.lastShot = time;
      }
    }
  }

  groundAttack(minions) {
    if(minions.length === 0)
      return

    const data = {
      images: [this.options.explosionSprite],
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

    let towerOptions = this.options.levels[this.level];

    minions.forEach((minion) => {
      minion.damageMinion(towerOptions.damage);
      minion.slowMinion(towerOptions.slowMult, towerOptions.slowLength, towerOptions.slowChance)
    });
  }

  removeExplosion() {
    const explosion = this.elements.getChildByName("explosion");
    this.elements.removeChild(explosion);
  }

  shootTurret(minions) {
    minions.forEach((minion) => {
      const options = {
        target: minion,
        speed: 5,
        damage: this.options.levels[this.level].damage,
      }

      if(this.options.bulletSprite)
        options["sprite"] = this.options.bulletSprite;

        if(this.options.explosionSprite)
          options["explosionSprite"] = this.options.explosionSprite;

      let projectile = new Projectile(options);
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
    const tower = this.elements.getChildByName("tower");
    tower.gotoAndPlay("base");
    this.hideRadius();
  }
}
