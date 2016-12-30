import Tower from "./tower";
import ToolBox from "./toolbox"
import Field from "./field";
import Minion from "./minion";

export default class Board {
  constructor(stage) {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", this.updateField.bind(this));

    stage.on("stagemousemove", this.mouseMove.bind(this));

    this.stage = stage;
    this.stage.enableMouseOver(20);


    this.boardSize = {
      x: 14,
      y: 14
    }

    this.boardWidth = this.stage.canvas.width;
    this.boardHeight = this.stage.canvas.height;

    this.field = this.generateField();
    this.toolbox = this.generateToolBox();

    this.lastSpawn = 0;

    this.update();
  }

  addMinions() {
    let minion = new Minion({height: 15, width: 15});
    this.field.createMinion(minion);
  }

  updateField() {
    this.field.moveMinions();
    this.field.rotateTurrets();
    this.field.moveProjectiles();

    let time = new Date().getTime();
    if(this.lastSpawn + 10000 < time) {
      this.addMinions();
      this.lastSpawn = time;
    }

    this.update();
  }

  generateField() {
    this.towerSize = 30;

    let field = new Field();

    this.stage.addChild(field.elements);

    field.elements.y = 60;


    return field;
  }

  generateToolBox() {
    const handles = {
      update: this.update.bind(this),
      newTower: this.newTower.bind(this)
    }
    let toolbox = new ToolBox(handles);

    this.stage.addChild(toolbox.elements);

    return toolbox;
  }

  update() {
    this.stage.update();
  }

  newTower(e) {
    let tower = new Tower(this.towerSize, this.update.bind(this));
    this.field.newTower(tower);
    this.stage.update();
  }

  mouseMove(e) {
    this.field.mouseMove(e);
  }
}
