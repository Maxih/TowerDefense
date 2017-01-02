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

    this.waves = Util.classicWaves();
    this.stageNum = 1;

    this.field = this.generateField();
    this.toolbox = this.generateToolBar();
  }

  addMinions() {
    const wave = this.waves[this.stageNum];
    for(let i = 0; i < wave.minions; i++) {
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
    this.updateWaves();


    let time = new Date().getTime();
    const wave = this.waves[this.stageNum];
    if(wave !== undefined) {
      if(this.lastSpawn + wave.time < time) {
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

    field.elements.on("click", this.placeTower.bind(this));

    this.stage.addChild(field.elements);

    return field;
  }

  placeTower() {
    let cost = this.field.placeTower()
    if(cost) {
      this.money -= cost;
    }
  }

  minionKilled(reward) {
    this.money += reward;
  }

  minionReachedEnd() {
    this.lives -= 1;
    this.updateLives();
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

  newDefaultTower() {
    let tower = new Tower({
      turretSprite: './assets/basicturret.png',
      rateOfFire: 1500,
      radius: 100,
      damage: 5,
      numTargets: 1,
      cost: 5,
    });

    if(tower.options.cost <= this.money) {
      this.field.newTower(tower);
    }
  }

  newFastTower(e) {
    let tower = new Tower({
      turretSprite: './assets/turret.png',
      rateOfFire: 500,
      radius: 100,
      damage: 10,
      numTargets: 1,
      cost: 15,
    });

    if(tower.options.cost <= this.money) {
      this.field.newTower(tower);
    }
  }

  newGroundAttackTower(e) {
    let tower = new Tower({
      turretSprite: './assets/groundattackturret.png',
      rateOfFire: 1000,
      radius: 50,
      damage: 50,
      numTargets: 0,
      cost: 200,
    });

    if(tower.options.cost <= this.money) {
      this.field.newTower(tower);
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
    this.newDefaultTowerButton();
    this.newFastTowerButton();
    this.newGroundAttackTowerButton();
    this.moneyCounter();
    this.livesCounter();
    this.nextWave();
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

  nextWave() {
    const waveBox = new createjs.Text(`${this.lives}`, "20px Arial", "LightBlue");
    const waveBoxLabel = new createjs.Text("Next wave", "20px Arial", "LightBlue");

    const toolBar = this.stage.getChildByName("toolbar");

    waveBox.name = "next-wave";
    waveBox.textBaseline = "alphabetic";
    waveBox.x = 270;
    waveBox.y = 45;

    waveBoxLabel.x = 260;
    waveBoxLabel.y = 5;

    toolBar.addChild(waveBox, waveBoxLabel);
  }

  newDefaultTowerButton() {
    const addTowerButton = new createjs.Shape();
    const toolBar = this.stage.getChildByName("toolbar");

    addTowerButton.graphics.beginFill("Orange").drawRect(15, 15, 30, 30).endFill();
    addTowerButton.on("click", this.newDefaultTower.bind(this));
    toolBar.addChild(addTowerButton);
  }

  newFastTowerButton() {
    const addTowerButton = new createjs.Shape();
    const toolBar = this.stage.getChildByName("toolbar");

    addTowerButton.graphics.beginFill("Purple").drawRect(60, 15, 30, 30).endFill();
    addTowerButton.on("click", this.newFastTower.bind(this));
    toolBar.addChild(addTowerButton);
  }

  newGroundAttackTowerButton() {
    const addTowerButton = new createjs.Shape();
    const toolBar = this.stage.getChildByName("toolbar");

    addTowerButton.graphics.beginFill("Green").drawRect(105, 15, 30, 30).endFill();
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

  updateWaves() {
    const toolBar = this.stage.getChildByName("toolbar");
    const waveBox = toolBar.getChildByName("next-wave");
    const wave = this.waves[this.stageNum];

    if(wave === undefined)
      return;

    let time = new Date().getTime();
    waveBox.text = ((wave.time - (time - this.lastSpawn)) / 1000).toFixed(1);
  }
}
