import PathFinder from "./pathfinder";

export default class Field {
  constructor(rows = 14, cols = 14) {
    this.elements = new createjs.Container();

    this.elements.on("click", this.placeTower.bind(this));

    this.towers = [];
    this.minions = {};
    this.projectiles = {};

    this.activeTower = null;

    this.generateField();

    this.minionId = 0;
    this.projectileId = 0;

    this.virtualBoard = new PathFinder();

    this.goalX = 13;
    this.goalY = 31;

    this.virtualBoard.findPath(this.goalX, this.goalY);

  }

  addMinion(minion) {
    const name = `minion-${this.minionId}`;
    minion.elements.x = 240;
    minion.elements.y = 0;
    minion.setPath(this.virtualBoard);
    this.minions[name] = minion;
    minion.elements.name = name;
    console.log(this.minions);

    this.elements.addChild(minion.elements);
    this.minionId++;
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
    this.towers.forEach((tower) => {
      tower.targetMinion(Object.values(this.minions))
    });

  }

  moveMinions() {
    const minions = Object.keys(this.minions);

    minions.forEach((key) => {
      if(this.minions[key].health < 0){
        this.killMinion(key);
      } else {
        this.setMinionPath(key);
      }
    });
  }

  setMinionPath(minionId) {
    const minion = this.minions[minionId];

    if(!minion.moveMinion()) {
      console.log(`A minion reached the end with ${minion.health} hp`);
      this.killMinion(minionId);
    }
  }

  killMinion(minionId) {
    let minionEl = this.elements.getChildByName(minionId);
    this.elements.removeChild(minionEl);
    this.minions[minionId].killMinion();
    delete this.minions[minionId];
  }

  moveProjectiles() {
    const projectiles = Object.keys(this.projectiles);

    projectiles.forEach((key) => {
      if(this.projectiles[key].adjustVector()) {
        this.removeProjectile(key);
      }
    });
  }

  removeProjectile(projectileId) {
    let projectileEl = this.elements.getChildByName(projectileId);
    this.projectiles[projectileId].deleteProjectile();
    this.elements.removeChild(projectileEl);
    delete this.projectiles[projectileId];
  }

  createProjectile(projectile) {
    // if(Object.values(this.projectiles).length > 0)
    //   return;
    const name = `proj-${this.projectileId}`;
    this.projectiles[name] = projectile;
    projectile.elements.name = name;
    this.elements.addChild(projectile.elements);

    this.projectileId++;
  }

  newTower(tower) {
    tower.createProjectile = this.createProjectile.bind(this);
    this.activeTower = tower
    this.elements.addChild(this.activeTower.elements);
    this.elements.setChildIndex(tower, this.elements.getNumChildren()-1);
  }

  placeTower(x, y) {
    if(this.activeTower === null)
      return

    if(this.validTowerPos())
      return

    this.updateVirtualBoard(this.activeTower.elements.x, this.activeTower.elements.y);

    this.virtualBoard.findPath(this.goalX, this.goalY);

    this.activeTower.activate();

    this.towers.push(this.activeTower);
    this.activeTower = null;
  }

  fieldToGrid(x) {
    // x -= 30;
    x /= 15;

    return Math.floor(x);
  }

  updateVirtualBoard(x, y) {
    x = this.fieldToGrid(x);
    y = this.fieldToGrid(y);

    this.virtualBoard.markWall(x - 1, y - 1);
    this.virtualBoard.markWall(x, y - 1);
    this.virtualBoard.markWall(x - 1, y);
    this.virtualBoard.markWall(x, y);
  }

  cursorToFieldPos(x, y) {
    x -= 8;
    y -= 8;

    let newX = Math.floor((x+15) / 15) * 15;
    let newY = Math.floor((y+15) / 15) * 15;

    newX = newX < 45 ? 45 : newX;
    newY = newY < 45 ? 45 : newY;

    newX = newX > (450 - 15) ? (450 - 15) : newX;
    newY = newY > (450 - 15) ? (450 - 15) : newY;

    return {x: newX, y: newY};
  }

  validTowerPos() {
    let minionIntersect = !Object.values(this.minions).every((minion) => {
      return !this.activeTower.intersect(minion);
    })
    return minionIntersect || !this.towers.every((tower) => {
      return !this.activeTower.intersect(tower);
    })
  }

  mouseMove(e) {
    let x = e.stageX - this.elements.x;
    let y = e.stageY - this.elements.y;

    if(this.activeTower === null)
      return

    if(this.validTowerPos()){

      this.activeTower.invalidPosition();
    } else {
      this.activeTower.validPosition();
    }

    const newPos = this.cursorToFieldPos(x, y);
    this.activeTower.setPos(newPos.x, newPos.y);
  }
}
