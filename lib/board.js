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

  toggleGame() {

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
    this.updateMoney();

    this.field.moveMinions();
    this.field.rotateTurrets();
    this.field.moveProjectiles();
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

  mouseMove(e) {
    this.field.mouseMove(e);
  }

  generateToolBar() {
    const toolBarContainer = new createjs.Container();
    toolBarContainer.name = "toolbar";

    const data = {
      images: ['./assets/toolbar.png'],
      frames: {width: 480, height: 60}
    };
    const spriteSheet = new createjs.SpriteSheet(data);
    const toolBarWrapper = new createjs.Sprite(spriteSheet);


    toolBarContainer.addChild(toolBarWrapper);
    this.stage.addChild(toolBarContainer);

    this.generateToolItems();
  }

  generateToolItems() {
    const defaultTowerOptions = {
      turretSprite: './assets/basicturret.png',
      rateOfFire: 1500,
      radius: 100,
      damage: 5,
      numTargets: 1,
      cost: 5,
    };
    this.newTowerButton(defaultTowerOptions, 15);

    const fastTowerOptions = {
      turretSprite: './assets/turret.png',
      rateOfFire: 500,
      radius: 100,
      damage: 10,
      numTargets: 1,
      cost: 15,
    };
    this.newTowerButton(fastTowerOptions, 60);

    const groundTowerOptions = {
      turretSprite: './assets/groundattackturret.png',
      rateOfFire: 1000,
      radius: 50,
      damage: 50,
      numTargets: 0,
      cost: 200,
    };
    this.newTowerButton(groundTowerOptions, 105);

    this.moneyCounter();
    this.livesCounter();
    this.nextWave();
  }

  moneyCounter() {
    const data = {
      images: ['./assets/coin.png'],
      frames: {width: 15, height: 15}
    };
    const spriteSheet = new createjs.SpriteSheet(data);
    const moneyBoxLabel = new createjs.Sprite(spriteSheet);

    const moneyBox = new createjs.Text(`${this.money}`, "15px Pixel", "Yellow");

    const toolBar = this.stage.getChildByName("toolbar");

    moneyBox.name = "money-box";
    moneyBox.textBaseline = "alphabetic";
    moneyBox.x = 420;
    moneyBox.y = 23;

    moneyBoxLabel.x = 400;
    moneyBoxLabel.y = 10;

    toolBar.addChild(moneyBox, moneyBoxLabel);
  }

  livesCounter() {
    const data = {
      images: ['./assets/lives.png'],
      frames: {width: 17, height: 15}
    };
    const spriteSheet = new createjs.SpriteSheet(data);
    const livesBoxLabel = new createjs.Sprite(spriteSheet);

    const livesBox = new createjs.Text(`${this.lives}`, "15px Pixel", "Red");
    const toolBar = this.stage.getChildByName("toolbar");

    livesBox.name = "lives-box";
    livesBox.textBaseline = "alphabetic";
    livesBox.x = 420;
    livesBox.y = 41;

    livesBoxLabel.x = 399;
    livesBoxLabel.y = 28;

    toolBar.addChild(livesBox, livesBoxLabel);
  }

  nextWave() {
    const waveBox = new createjs.Shape();
    const waveBoxLabel = new createjs.Shape();

    const toolBar = this.stage.getChildByName("toolbar");

    waveBox.name = "next-wave";

    waveBoxLabel.graphics.beginFill("Black").drawRect(0, 58, 480, 2).endFill();
    waveBox.graphics.beginFill("Yellow").drawRect(0, 58, 480, 2).endFill();


    toolBar.addChild(waveBoxLabel, waveBox);
  }


  newTowerButton(options, offset) {
    const toolBar = this.stage.getChildByName("toolbar");

    const tower = new createjs.Container();
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
    const towerButton = new createjs.Sprite(spriteSheet);

    const turretData = {
      images: [options.turretSprite],
      frames: {width: 30, height: 30}
    };
    const turretSpriteSheet = new createjs.SpriteSheet(turretData);
    const turret = new createjs.Sprite(turretSpriteSheet);


    tower.on("click", this.newTower.bind(this, options));
    tower.on("mouseover", this.colorTower.bind(this, towerButton, options.cost));
    tower.on("mouseout", this.decolorTower.bind(this, towerButton));

    tower.addChild(towerButton, turret);

    tower.y = 15;
    tower.x = offset;
    tower.cursor = "pointer";

    toolBar.addChild(tower);
  }

  newTower(options) {
    if(options.cost <= this.money) {
      let tower = new Tower(options);
      this.field.newTower(tower);
    }
  }

  colorTower(tower, cost) {
    if(cost <= this.money)
      tower.gotoAndPlay("valid");
    else
      tower.gotoAndPlay("invalid");
  }

  decolorTower(tower) {
    tower.gotoAndPlay("base");

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
    let timePercent = 1 - ((time - this.lastSpawn) / wave.time);
    let barWidth = 480 * timePercent;
    waveBox.graphics.clear().beginFill("Yellow").drawRect(0, 58, barWidth, 2).endFill();
  }
}
