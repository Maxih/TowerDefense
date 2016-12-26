import PathFinder from "./pathfinder";

export default class Field {
  constructor(update, rows = 14, cols = 14) {
    this.elements = new createjs.Container();

    this.elements.on("click", this.placeTower.bind(this));

    this.towers = [];
    this.minions = {};
    this.projectiles = {};
    this.update = update;

    this.activeTower = null;

    this.generateField();

    this.minionId = 0;
    this.projectileId = 0;

    this.virtualBoard = new PathFinder();

    this.goalX = 13;
    this.goalY = 27;

    this.virtualBoard.findPath(this.goalX, this.goalY);

  }

  addMinion(minion) {
    minion.elements.x = 240;
    minion.elements.y = 0;
    minion.elements.name = this.minionId;
    minion.setPath(this.virtualBoard);
    this.minions[this.minionId] = minion;


    this.elements.addChild(minion.elements);

    this.update();

    this.minionId++;
  }


  generateField() {
    let field = this.fieldSprite();
    field.name = "field";
    this.elements.addChild(field);
    this.update();
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
        this.setMinionPath(this.minions[key]);
      }
    });
  }

  setMinionPath(minion) {

    // let startX = this.fieldToGrid(minion.elements.x);
    // let startY = this.fieldToGrid(minion.elements.y);
    //
    // let endX = this.goalX;
    // let endY = this.goalY;
    //   // console.log(startX, startY, endX, endY);
    //
    // const path = this.virtualBoard.getPathToCoord(startX, startY, endX, endY);
    //
    // minion.setPath(path);

    minion.moveMinion();
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
        this.projectiles[key].deleteProjectile();
        delete this.projectiles[key];
      }
    });
  }

  createProjectile(projectile) {
    // if(Object.values(this.projectiles).length > 0)
    //   return;
    this.projectiles[this.projectileId] = projectile;
    this.elements.addChild(projectile.elements);

    this.update();
    this.projectileId++;
  }

  newTower(tower) {
    tower.createProjectile = this.createProjectile.bind(this);
    this.activeTower = tower
    this.elements.addChild(this.activeTower.elements);
    this.elements.setChildIndex(tower, this.elements.getNumChildren()-1);
    this.update();
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
    x -= 30;
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
    return !this.towers.every((tower) => {
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
    this.update();
  }
}
