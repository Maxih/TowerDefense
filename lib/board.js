import Tower from "./tower";
import Field from "./field";
import Minion from "./minion";
import * as MinionUtil from "./util/minion_wave_utils";
import * as TowerUtil from "./util/tower_utils";

export default class Board {
  constructor(stage, test) {
    this.stage = stage;

    this.boardWidth = this.stage.canvas.width;
    this.boardHeight = this.stage.canvas.height;

    this.lastSpawn = new Date().getTime();
    this.money = 100;
    this.lives = 20;

    this.waves = MinionUtil.CLASSIC;
    this.stageNum = 1;

    this.field = this.generateField();
    this.toolbar = this.generateToolBar();
    this.generateToolItems();

    this.playing = false;

    this.onLose = () => {};
    this.onWin = () => {};
  }

  toggleGame() {
    if(!this.playing) {
      this.playing = true;
    } else {
      this.sendWave();
    }
  }

  addMinions() {
    const wave = this.waves[this.stageNum];

    if(wave === undefined)
      return;

    for(let i = 0; i < wave.minions; i++) {
      let minion = new Minion(wave.stats);
      this.field.createMinion(minion);
    }
    this.stageNum++;
  }

  updateField() {
    this.field.checkValidTower();
    this.updateMoney();
    this.canUpgrade();
    this.updateTowerInfo();



    if(this.playing) {
      if(this.lives <= 0)
        this.loseGame();

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
    }

    this.update();
  }

  loseGame() {
    this.playing = false;
    this.onLose();
  }

  sendWave() {
    this.addMinions();
    this.lastSpawn = new Date().getTime();
  }

  canUpgrade() {
    const upgrade = this.toolbar.getChildByName("upgrade");

    if(this.field.activeTower !== null) {
      if(this.field.activeTower.active) {
        if(this.field.activeTower.upgradeCost() <= this.money && this.field.activeTower.upgradeCost() > 0) {
          upgrade.gotoAndPlay("base");
          return;
        }
      }
    }
    upgrade.gotoAndPlay("invalid");
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

    this.checkWin();
  }

  checkWin() {
    const wave = this.waves[this.stageNum];
    if(wave === undefined && Object.keys(this.field.minions).length === 0)
      this.onWin();
  }

  minionReachedEnd() {
    this.lives -= 1;
    this.updateLives();
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


    return toolBarContainer;
  }

  generateToolItems() {

    this.newTowerButton(TowerUtil.BASE_TOWER, 130);
    this.newTowerButton(TowerUtil.FAST_TOWER, 175);
    this.newTowerButton(TowerUtil.GROUND_TOWER, 220);

    this.moneyCounter();
    this.livesCounter();
    this.nextWave();
    this.upgradeTowerButton();
    this.towerInfo();
    this.playButton();
  }

  towerInfo() {
    const towerInfo = new createjs.Text("", "15px Pixel", "#F1F1F1");


    towerInfo.name = "tower-info";
    towerInfo.x = 310;
    towerInfo.y = 5;

    this.toolbar.addChild(towerInfo);
  }

  moneyCounter() {
    const data = {
      images: ['./assets/coin.png'],
      frames: {width: 15, height: 15}
    };
    const spriteSheet = new createjs.SpriteSheet(data);
    const moneyBoxLabel = new createjs.Sprite(spriteSheet);

    const moneyBox = new createjs.Text(`${this.money}`, "15px Pixel", "Yellow");

    moneyBox.name = "money-box";
    moneyBox.textBaseline = "alphabetic";
    moneyBox.x = 80;
    moneyBox.y = 23;

    moneyBoxLabel.x = 60;
    moneyBoxLabel.y = 10;

    this.toolbar.addChild(moneyBox, moneyBoxLabel);
  }

  livesCounter() {
    const data = {
      images: ['./assets/lives.png'],
      frames: {width: 17, height: 15}
    };
    const spriteSheet = new createjs.SpriteSheet(data);
    const livesBoxLabel = new createjs.Sprite(spriteSheet);

    const livesBox = new createjs.Text(`${this.lives}`, "15px Pixel", "Red");

    livesBox.name = "lives-box";
    livesBox.textBaseline = "alphabetic";
    livesBox.x = 80;
    livesBox.y = 41;

    livesBoxLabel.x = 59;
    livesBoxLabel.y = 28;

    this.toolbar.addChild(livesBox, livesBoxLabel);
  }

  upgradeTowerButton() {
    const data = {
      images: ['./assets/arrow.png'],
      frames: {width:30, height:30, count:1, spacing:0, margin:0},
      animations: {
        base: {
          frames: [0],
        },
        invalid: {
          frames: [1],
        }
      }
    };
    const spriteSheet = new createjs.SpriteSheet(data);
    const upgradeArrow = new createjs.Sprite(spriteSheet, "base");

    upgradeArrow.on("click", this.upgradeTower.bind(this));

    upgradeArrow.x = 265;
    upgradeArrow.y = 15;
    upgradeArrow.cursor = "pointer";
    upgradeArrow.name = "upgrade";


    this.toolbar.addChild(upgradeArrow);
  }

  upgradeTower() {
    if(this.field.activeTower !== null) {
      if(this.field.activeTower.upgradeCost() <= this.money) {
        this.money -= this.field.activeTower.upgradeCost();
        this.field.upgradeTower();
      }
    }
  }

  nextWave() {
    const waveBox = new createjs.Shape();
    const waveBoxLabel = new createjs.Shape();

    waveBox.name = "next-wave";

    waveBoxLabel.graphics.beginFill("Black").drawRect(0, 58, 480, 2).endFill();
    waveBox.graphics.beginFill("Yellow").drawRect(0, 58, 480, 2).endFill();


    this.toolbar.addChild(waveBoxLabel, waveBox);
  }

  playButton() {
    const play = new createjs.Container();
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
    const playButton = new createjs.Sprite(spriteSheet);

    const turretData = {
      images: ['./assets/play.png'],
      frames: {width: 30, height: 30}
    };
    const turretSpriteSheet = new createjs.SpriteSheet(turretData);
    const turret = new createjs.Sprite(turretSpriteSheet);

    play.on("click", this.toggleGame.bind(this));

    play.addChild(playButton, turret);

    play.y = 15;
    play.x = 15;
    play.cursor = "pointer";

    this.toolbar.addChild(play);
  }

  newTowerButton(options, offset) {
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
    tower.on("mouseover", this.colorTower.bind(this, towerButton, options.levels[1].cost));
    tower.on("mouseout", this.decolorTower.bind(this, towerButton));

    tower.addChild(towerButton, turret);

    tower.y = 15;
    tower.x = offset;
    tower.cursor = "pointer";

    this.toolbar.addChild(tower);
  }

  newTower(options) {
    if(options.levels[1].cost <= this.money) {
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
    const moneyBox = this.toolbar.getChildByName("money-box");

    if(moneyBox.text != this.money) {
      moneyBox.text = this.money
    }
  }

  updateLives() {
    const livesBox = this.toolbar.getChildByName("lives-box");

    if(livesBox.text != this.lives) {
      livesBox.text = this.lives
    }
  }

  updateTowerInfo() {
    const towerInfo = this.toolbar.getChildByName("tower-info");

    if(this.field.activeTower !== null) {
      const towerOptions = this.field.activeTower.towerOptions();
      towerInfo.text = `${towerOptions.damage.toFixed(1)} - Damage\n${(towerOptions.rateOfFire / 1000).toFixed(1)}  - Fire Rate\n${towerOptions.cost.toFixed(1)} - Cost`;
    }
    else
      towerInfo.text = "";

  }

  updateWaves() {
    const waveBox = this.toolbar.getChildByName("next-wave");
    const wave = this.waves[this.stageNum];

    if(wave === undefined)
      return;

    let time = new Date().getTime();
    let timePercent = 1 - ((time - this.lastSpawn) / wave.time);
    let barWidth = 480 * timePercent;
    waveBox.graphics.clear().beginFill("Yellow").drawRect(0, 58, barWidth, 2).endFill();
  }
}
