import Tower from "./tower";
import Field from "./field";
import Minion from "./minion";
import * as Util from "./util/minion_wave_utils";

export default class Board {
  constructor(stage) {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", this.updateField.bind(this));

    stage.on("stagemousemove", this.mouseMove.bind(this));

    this.stage = stage;
    this.stage.enableMouseOver(20);

    this.boardWidth = this.stage.canvas.width;
    this.boardHeight = this.stage.canvas.height;

    this.lastSpawn = new Date().getTime();
    this.money = 100;
    this.lives = 20;

    this.field = this.generateField();
    this.toolbox = this.generateToolBar();

    this.waves = Util.classicWaves();
    this.stageNum = 1;
  }

  addMinions() {
    const wave = this.waves[this.stageNum];
    console.log(wave);
    for(let i = 0; i < wave.minions; i++) {
      console.log("wave")
      let minion = new Minion(wave.stats);
      this.field.createMinion(minion);
    }
    this.stageNum++;
  }

  updateField() {
    this.field.checkValidTower();
    this.field.moveMinions();
    this.field.rotateTurrets();
    this.field.moveProjectiles();
    this.updateMoney();


    let time = new Date().getTime();
    const wave = this.waves[this.stageNum];
    if(wave !== undefined) {
      if(this.lastSpawn + wave.time < time) {
        console.log("sending out wave")
        this.addMinions();
        this.lastSpawn = time;
      }
    }
    this.update();
  }

  generateField() {
    const field = new Field();

    field.elements.y = 60;
    field.minionKilled = this.minionKilled.bind(this);
    field.minionReachedEnd = this.minionReachedEnd.bind(this);


    this.stage.addChild(field.elements);

    return field;
  }

  minionKilled(reward) {
    this.money += reward;
    console.log("Dead");
  }

  minionReachedEnd() {
    this.lives -= 1;
    this.updateLives();
    console.log("lost live");
  }

  generateToolBox() {
    const handles = {
      update: this.update.bind(this),
      newTower: this.newTower.bind(this),
      newGroundAttackTower: this.newGroundAttackTower.bind(this)
    }
    let toolbox = new ToolBox(handles);

    this.stage.addChild(toolbox.elements);

    return toolbox;
  }

  update() {
    this.stage.update();
  }

  newTower(e) {
    let tower = new Tower({rateOfFire: 500, radius: 100, numTargets: 1});
    if(tower.options.cost <= this.money) {
      this.field.newTower(tower);
      this.money -= tower.options.cost;
    }
  }

  newGroundAttackTower(e) {
    let tower = new Tower({rateOfFire: 1000, radius: 50, numTargets: 0, turretSprite: './assets/groundattackturret.png'});
    if(tower.options.cost <= this.money) {
      this.field.newTower(tower);
      this.money -= tower.options.cost;
    }
  }

  mouseMove(e) {
    this.field.mouseMove(e);
  }

  generateToolBar() {
    const toolBarContainer = new createjs.Container();
    const toolBarWrapper = new createjs.Shape();

    toolBarContainer.name = "toolbar";

    toolBarWrapper.graphics.beginFill("Black").drawRect(0, 0, 480, 60).endFill();

    toolBarContainer.addChild(toolBarWrapper);
    this.stage.addChild(toolBarContainer);

    this.generateToolItems();
  }

  generateToolItems() {
    this.newTowerButton();
    this.newGroundAttackTowerButton();
    this.moneyCounter();
    this.livesCounter();
  }

  moneyCounter() {
    const moneyBox = new createjs.Text(`${this.money}`, "20px Arial", "Yellow");
    const moneyBoxLabel = new createjs.Text("Bank", "20px Arial", "Yellow");

    const toolBar = this.stage.getChildByName("toolbar");

    moneyBox.name = "money-box";
    moneyBox.textBaseline = "alphabetic";
    moneyBox.x = 420;
    moneyBox.y = 45;

    moneyBoxLabel.x = 415;
    moneyBoxLabel.y = 5;

    toolBar.addChild(moneyBox, moneyBoxLabel);
  }

  livesCounter() {
    const livesBox = new createjs.Text(`${this.lives}`, "20px Arial", "LightBlue");
    const livesBoxLabel = new createjs.Text("Lives", "20px Arial", "LightBlue");

    const toolBar = this.stage.getChildByName("toolbar");

    livesBox.name = "lives-box";
    livesBox.textBaseline = "alphabetic";
    livesBox.x = 360;
    livesBox.y = 45;

    livesBoxLabel.x = 350;
    livesBoxLabel.y = 5;

    toolBar.addChild(livesBox, livesBoxLabel);
  }

  newTowerButton() {
    const addTowerButton = new createjs.Shape();
    const toolBar = this.stage.getChildByName("toolbar");

    addTowerButton.graphics.beginFill("Purple").drawRect(15, 15, 30, 30).endFill();
    addTowerButton.on("click", this.newTower.bind(this));
    toolBar.addChild(addTowerButton);
  }

  newGroundAttackTowerButton() {
    const addTowerButton = new createjs.Shape();
    const toolBar = this.stage.getChildByName("toolbar");

    addTowerButton.graphics.beginFill("Green").drawRect(60, 15, 30, 30).endFill();
    addTowerButton.on("click", this.newGroundAttackTower.bind(this));
    toolBar.addChild(addTowerButton);
  }

  updateMoney() {
    const toolBar = this.stage.getChildByName("toolbar");
    const moneyBox = toolBar.getChildByName("money-box");

    if(moneyBox.text != this.money) {
      moneyBox.text = this.money
    }
  }

  updateLives() {
    const toolBar = this.stage.getChildByName("toolbar");
    const livesBox = toolBar.getChildByName("lives-box");

    if(livesBox.text != this.lives) {
      livesBox.text = this.lives
    }
  }
}
