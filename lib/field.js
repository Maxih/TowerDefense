import * as Util from "./util/field_utils";
import PathFinder from "./pathfinder";
import merge from "lodash/merge";

export default class Field {
  constructor(rows = 14, cols = 14) {
    this.elements = new createjs.Container();

    this.towers = {};
    this.minions = {};
    this.projectiles = {};

    this.activeTower = null;

    this.generateField();

    this.minionId = 0;
    this.projectileId = 0;
    this.towerId = 0;

    this.virtualBoard = new PathFinder();

    this.goalX = 15;
    this.goalY = 31;

    this.virtualBoard.findPath(this.goalX, this.goalY);

    this.minionKilled = () => {};
    this.minionReachedEnd = () => {};

    this.elements.on("click", this.selectTower.bind(this));
    this.elements.on("mouseover", this.showRadius.bind(this));
  }

  selectTower(e) {
    if(e.target.name === null) {
      return;
    }

    if(e.target.name.substring(0, 5) === "tower") {
      let tower = this.towers[e.target.name];

      if(tower === undefined)
        return;

      tower.drawValidTower();
      if(this.activeTower !== null) {
        if(!this.activeTower.active)
          return;
        else
          this.activeTower.activate();
      }

      this.activeTower = tower;
    }
    else {
      if(this.activeTower !== null) {
        if(this.activeTower.active)
          this.activeTower.activate();

        this.activeTower = null;
      }
    }
  }

  showRadius(e) {
    if(e.target.name === null)
      return;


    if(e.target.name.substring(0, 5) === "tower") {
      let tower = this.towers[e.target.name];

      if(tower === undefined)
        return;


      this.towers[e.target.name].drawRadius();
    }
  }

  generateField() {
    let field = this.fieldSprite();
    field.name = "field";
    this.elements.addChild(field);
  }

  fieldSprite() {
    const data = {
      images: ['./assets/fieldborder.png'],
      frames: {width: 480, height: 480}
    };
    const spriteSheet = new createjs.SpriteSheet(data);
    const field = new createjs.Sprite(spriteSheet);

    return field;
  }

  rotateTurrets() {
    Object.values(this.towers).forEach((tower) => {
      tower.targetMinion(this.minions)
    });

  }

  moveMinions() {
    const minions = Object.keys(this.minions);

    minions.forEach((key) => {
      if(this.minions[key].health <= 0){
        this.minionKilled(this.killMinion(key));
      } else {
        this.setMinionPath(key);
      }
    });

  }

  setMinionPath(minionId) {
    const minion = this.minions[minionId];
    const minionCoord = minion.fieldToGrid();
    const minionTarget = this.virtualBoard.getPathToCoord(minionCoord.x, minionCoord.y, 15, 31);

    if(!minion.moveMinion(minionTarget)) {
      this.minionReachedEnd();
      this.killMinion(minionId);
    }
  }

  createMinion(minion) {
    const name = `minion-${this.minionId}`;

    minion.setPath(this.virtualBoard);
    this.minions[name] = minion;
    minion.elements.name = name;
    minion.elements.x = 180 + Math.random() * 120;
    minion.elements.y = 0;

    this.elements.addChild(minion.elements);
    this.minionId++;
  }

  killMinion(minionId) {
    const reward = this.minions[minionId].options.reward;
    let minionEl = this.elements.getChildByName(minionId);
    this.elements.removeChild(minionEl);
    delete this.minions[minionId];
    return reward;
  }

  removeMinion(minionId) {

  }

  moveProjectiles() {
    const projectiles = Object.keys(this.projectiles);

    projectiles.forEach((key) => {
      if(this.projectiles[key].moveProjectile()) {
        this.destroyProjectile(key);
      }
    });
  }

  destroyProjectile(projectileId) {
    let projectileEl = this.projectiles[projectileId];
    projectileEl.beginRemove(this.removeProjectile.bind(this, projectileId));
  }

  removeProjectile(projectileId) {
    let projectileEl = this.elements.getChildByName(projectileId);
    this.elements.removeChild(projectileEl);
    delete this.projectiles[projectileId];
  }

  createProjectile(projectile) {
    const name = `proj-${this.projectileId}`;
    this.projectiles[name] = projectile;
    projectile.elements.name = name;
    this.elements.addChild(projectile.elements);

    this.projectileId++;
  }

  newTower(tower) {
    const name = `tower-${this.towerId}`;
    tower.elements.name = name;
    this.towerId++;

    if(this.activeTower !== null) {
      if(!this.activeTower.active) {
        let towerEl = this.elements.getChildByName(this.activeTower.elements.name);
        this.elements.removeChild(towerEl);
      } else {
        this.activeTower.activate();
      }
      this.activeTower = null;
    }

    tower.createProjectile = this.createProjectile.bind(this);
    this.activeTower = tower
    this.elements.addChild(this.activeTower.elements);
    this.elements.setChildIndex(tower, this.elements.getNumChildren()-1);
  }

  placeTower() {
    if(this.activeTower === null)
      return false;

    if(this.validTowerPos())
      return false;

    const virtualBoardCopy = this.virtualBoard.dupBoard();

    let newX = this.fieldToGrid(this.activeTower.elements.x);
    let newY = this.fieldToGrid(this.activeTower.elements.y);

    virtualBoardCopy.update(newX, newY);

    virtualBoardCopy.findPath(this.goalX, this.goalY);


    if(virtualBoardCopy.getPathToCoord(16, 0, this.goalX, this.goalY) === undefined) {
      console.log("Blocking");
      return false;
    } else {
      let cost = this.activeTower.options.cost;
      this.virtualBoard = virtualBoardCopy;
      this.activeTower.activate();

      this.towers[this.activeTower.elements.name] = this.activeTower;
      this.activeTower = null;
      return cost;
    }
  }

  fieldToGrid(x) {
    // x -= 30;
    x /= 15;

    return Math.floor(x);
  }

  checkValidTower() {
    if(this.activeTower === null)
      return

      if(this.activeTower.active)
        return;

    if(this.validTowerPos()){
      this.activeTower.invalidPosition();
    } else {
      this.activeTower.validPosition();
    }
  }

  validTowerPos() {
    let minionIntersect = !Object.values(this.minions).every((minion) => {
      return !this.activeTower.intersects(minion);
    })
    return minionIntersect || !Object.values(this.towers).every((tower) => {
      return !this.activeTower.intersects(tower);
    })
  }

  mouseMove(e) {
    let x = e.stageX - this.elements.x;
    let y = e.stageY - this.elements.y;

    if(this.activeTower === null)
      return;

    if(this.activeTower.active)
      return;

    const newPos = Util.cursorToFieldPos(x, y);
    this.activeTower.setPos(newPos.x, newPos.y);
  }
}
