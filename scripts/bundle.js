/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _board = __webpack_require__(1);
	
	var _board2 = _interopRequireDefault(_board);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	$(function () {
	  var stage = new createjs.Stage("tower-defense");
	
	  var game = new TowerDefense(stage);
	
	  $(".reset-button").click(function (e) {
	    game.newBoard();
	  });
	});
	
	var TowerDefense = function () {
	  function TowerDefense(stage) {
	    _classCallCheck(this, TowerDefense);
	
	    this.num = 0;
	
	    this.stage = stage;
	    this.board = null;
	
	    this.newBoard();
	
	    createjs.Ticker.setFPS(60);
	    createjs.Ticker.addEventListener("tick", this.updateBoard.bind(this));
	
	    stage.on("stagemousemove", this.mouseMove.bind(this));
	    this.stage.enableMouseOver(20);
	  }
	
	  _createClass(TowerDefense, [{
	    key: "mouseMove",
	    value: function mouseMove(e) {
	      if (!this.board) return;
	
	      this.board.mouseMove(e);
	    }
	  }, {
	    key: "updateBoard",
	    value: function updateBoard() {
	      if (!this.board) return;
	
	      this.board.updateField();
	    }
	  }, {
	    key: "newBoard",
	    value: function newBoard() {
	      this.stage.removeAllChildren();
	      delete this.board;
	      this.board = null;
	      this.board = new _board2.default(this.stage, this.num);
	      this.board.onLose = this.displayLose.bind(this);
	      this.board.onWin = this.displayWin.bind(this);
	
	      this.num++;
	    }
	  }, {
	    key: "displayLose",
	    value: function displayLose() {
	      this.displayMessage("You Lose.");
	    }
	  }, {
	    key: "displayWin",
	    value: function displayWin() {
	      this.displayMessage("You Win!!!");
	    }
	  }, {
	    key: "displayMessage",
	    value: function displayMessage(message) {
	      this.stage.removeAllChildren();
	
	      var messageText = new createjs.Text(message, "50px Pixel", "#F1F1F1");
	
	      messageText.x = 100;
	      messageText.y = 200;
	
	      this.stage.addChild(messageText);
	    }
	  }]);

	  return TowerDefense;
	}();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _tower = __webpack_require__(2);
	
	var _tower2 = _interopRequireDefault(_tower);
	
	var _field = __webpack_require__(7);
	
	var _field2 = _interopRequireDefault(_field);
	
	var _minion = __webpack_require__(9);
	
	var _minion2 = _interopRequireDefault(_minion);
	
	var _minion_wave_utils = __webpack_require__(107);
	
	var MinionUtil = _interopRequireWildcard(_minion_wave_utils);
	
	var _tower_utils = __webpack_require__(108);
	
	var TowerUtil = _interopRequireWildcard(_tower_utils);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Board = function () {
	  function Board(stage, test) {
	    _classCallCheck(this, Board);
	
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
	
	    this.onLose = function () {};
	    this.onWin = function () {};
	  }
	
	  _createClass(Board, [{
	    key: "toggleGame",
	    value: function toggleGame() {
	      if (!this.playing) {
	        this.playing = true;
	      } else {
	        this.sendWave();
	      }
	    }
	  }, {
	    key: "addMinions",
	    value: function addMinions() {
	      var wave = this.waves[this.stageNum];
	
	      if (wave === undefined) return;
	
	      for (var i = 0; i < wave.minions; i++) {
	        var minion = new _minion2.default(wave.stats);
	        this.field.createMinion(minion);
	      }
	      this.stageNum++;
	    }
	  }, {
	    key: "updateField",
	    value: function updateField() {
	      this.field.checkValidTower();
	      this.updateMoney();
	      this.canUpgrade();
	      this.updateTowerInfo();
	
	      if (this.playing) {
	        if (this.lives <= 0) this.loseGame();
	
	        this.field.moveMinions();
	        this.field.rotateTurrets();
	        this.field.moveProjectiles();
	        this.updateWaves();
	
	        var time = new Date().getTime();
	        var wave = this.waves[this.stageNum];
	        if (wave !== undefined) {
	          if (this.lastSpawn + wave.time < time) {
	            this.addMinions();
	            this.lastSpawn = time;
	          }
	        }
	      }
	
	      this.update();
	    }
	  }, {
	    key: "loseGame",
	    value: function loseGame() {
	      this.playing = false;
	      this.onLose();
	    }
	  }, {
	    key: "sendWave",
	    value: function sendWave() {
	      this.addMinions();
	      this.lastSpawn = new Date().getTime();
	    }
	  }, {
	    key: "canUpgrade",
	    value: function canUpgrade() {
	      var upgrade = this.toolbar.getChildByName("upgrade");
	
	      if (this.field.activeTower !== null) {
	        if (this.field.activeTower.active) {
	          if (this.field.activeTower.upgradeCost() <= this.money && this.field.activeTower.upgradeCost() > 0) {
	            upgrade.gotoAndPlay("base");
	            return;
	          }
	        }
	      }
	      upgrade.gotoAndPlay("invalid");
	    }
	  }, {
	    key: "generateField",
	    value: function generateField() {
	      var field = new _field2.default();
	
	      field.elements.y = 60;
	      field.minionKilled = this.minionKilled.bind(this);
	      field.minionReachedEnd = this.minionReachedEnd.bind(this);
	
	      field.elements.on("click", this.placeTower.bind(this));
	
	      this.stage.addChild(field.elements);
	
	      return field;
	    }
	  }, {
	    key: "placeTower",
	    value: function placeTower() {
	      var cost = this.field.placeTower();
	      if (cost) {
	        this.money -= cost;
	      }
	    }
	  }, {
	    key: "minionKilled",
	    value: function minionKilled(reward) {
	      this.money += reward;
	
	      this.checkWin();
	    }
	  }, {
	    key: "checkWin",
	    value: function checkWin() {
	      var wave = this.waves[this.stageNum];
	      if (wave === undefined && Object.keys(this.field.minions).length === 0) this.onWin();
	    }
	  }, {
	    key: "minionReachedEnd",
	    value: function minionReachedEnd() {
	      this.lives -= 1;
	      this.updateLives();
	    }
	  }, {
	    key: "update",
	    value: function update() {
	      this.stage.update();
	    }
	  }, {
	    key: "mouseMove",
	    value: function mouseMove(e) {
	      this.field.mouseMove(e);
	    }
	  }, {
	    key: "generateToolBar",
	    value: function generateToolBar() {
	      var toolBarContainer = new createjs.Container();
	      toolBarContainer.name = "toolbar";
	
	      var data = {
	        images: ['./assets/toolbar.png'],
	        frames: { width: 480, height: 60 }
	      };
	      var spriteSheet = new createjs.SpriteSheet(data);
	      var toolBarWrapper = new createjs.Sprite(spriteSheet);
	
	      toolBarContainer.addChild(toolBarWrapper);
	      this.stage.addChild(toolBarContainer);
	
	      return toolBarContainer;
	    }
	  }, {
	    key: "generateToolItems",
	    value: function generateToolItems() {
	
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
	  }, {
	    key: "towerInfo",
	    value: function towerInfo() {
	      var towerInfo = new createjs.Text("", "15px Pixel", "#F1F1F1");
	
	      towerInfo.name = "tower-info";
	      towerInfo.x = 310;
	      towerInfo.y = 5;
	
	      this.toolbar.addChild(towerInfo);
	    }
	  }, {
	    key: "moneyCounter",
	    value: function moneyCounter() {
	      var data = {
	        images: ['./assets/coin.png'],
	        frames: { width: 15, height: 15 }
	      };
	      var spriteSheet = new createjs.SpriteSheet(data);
	      var moneyBoxLabel = new createjs.Sprite(spriteSheet);
	
	      var moneyBox = new createjs.Text("" + this.money, "15px Pixel", "Yellow");
	
	      moneyBox.name = "money-box";
	      moneyBox.textBaseline = "alphabetic";
	      moneyBox.x = 80;
	      moneyBox.y = 23;
	
	      moneyBoxLabel.x = 60;
	      moneyBoxLabel.y = 10;
	
	      this.toolbar.addChild(moneyBox, moneyBoxLabel);
	    }
	  }, {
	    key: "livesCounter",
	    value: function livesCounter() {
	      var data = {
	        images: ['./assets/lives.png'],
	        frames: { width: 17, height: 15 }
	      };
	      var spriteSheet = new createjs.SpriteSheet(data);
	      var livesBoxLabel = new createjs.Sprite(spriteSheet);
	
	      var livesBox = new createjs.Text("" + this.lives, "15px Pixel", "Red");
	
	      livesBox.name = "lives-box";
	      livesBox.textBaseline = "alphabetic";
	      livesBox.x = 80;
	      livesBox.y = 41;
	
	      livesBoxLabel.x = 59;
	      livesBoxLabel.y = 28;
	
	      this.toolbar.addChild(livesBox, livesBoxLabel);
	    }
	  }, {
	    key: "upgradeTowerButton",
	    value: function upgradeTowerButton() {
	      var data = {
	        images: ['./assets/arrow.png'],
	        frames: { width: 30, height: 30, count: 1, spacing: 0, margin: 0 },
	        animations: {
	          base: {
	            frames: [0]
	          },
	          invalid: {
	            frames: [1]
	          }
	        }
	      };
	      var spriteSheet = new createjs.SpriteSheet(data);
	      var upgradeArrow = new createjs.Sprite(spriteSheet, "base");
	
	      upgradeArrow.on("click", this.upgradeTower.bind(this));
	
	      upgradeArrow.x = 265;
	      upgradeArrow.y = 15;
	      upgradeArrow.cursor = "pointer";
	      upgradeArrow.name = "upgrade";
	
	      this.toolbar.addChild(upgradeArrow);
	    }
	  }, {
	    key: "upgradeTower",
	    value: function upgradeTower() {
	      if (this.field.activeTower !== null) {
	        if (this.field.activeTower.upgradeCost() <= this.money) {
	          this.money -= this.field.activeTower.upgradeCost();
	          this.field.upgradeTower();
	        }
	      }
	    }
	  }, {
	    key: "nextWave",
	    value: function nextWave() {
	      var waveBox = new createjs.Shape();
	      var waveBoxLabel = new createjs.Shape();
	
	      waveBox.name = "next-wave";
	
	      waveBoxLabel.graphics.beginFill("Black").drawRect(0, 58, 480, 2).endFill();
	      waveBox.graphics.beginFill("Yellow").drawRect(0, 58, 480, 2).endFill();
	
	      this.toolbar.addChild(waveBoxLabel, waveBox);
	    }
	  }, {
	    key: "playButton",
	    value: function playButton() {
	      var play = new createjs.Container();
	      var data = {
	        images: ['./assets/tower.png'],
	        frames: { width: 30, height: 30, count: 3, spacing: 0, margin: 0 },
	        animations: {
	          base: {
	            frames: [0]
	          },
	          valid: {
	            frames: [1]
	          },
	          invalid: {
	            frames: [2]
	          }
	        }
	      };
	      var spriteSheet = new createjs.SpriteSheet(data);
	      var playButton = new createjs.Sprite(spriteSheet);
	
	      var turretData = {
	        images: ['./assets/play.png'],
	        frames: { width: 30, height: 30 }
	      };
	      var turretSpriteSheet = new createjs.SpriteSheet(turretData);
	      var turret = new createjs.Sprite(turretSpriteSheet);
	
	      play.on("click", this.toggleGame.bind(this));
	
	      play.addChild(playButton, turret);
	
	      play.y = 15;
	      play.x = 15;
	      play.cursor = "pointer";
	
	      this.toolbar.addChild(play);
	    }
	  }, {
	    key: "newTowerButton",
	    value: function newTowerButton(options, offset) {
	      var tower = new createjs.Container();
	      var data = {
	        images: ['./assets/tower.png'],
	        frames: { width: 30, height: 30, count: 3, spacing: 0, margin: 0 },
	        animations: {
	          base: {
	            frames: [0]
	          },
	          valid: {
	            frames: [1]
	          },
	          invalid: {
	            frames: [2]
	          }
	        }
	      };
	      var spriteSheet = new createjs.SpriteSheet(data);
	      var towerButton = new createjs.Sprite(spriteSheet);
	
	      var turretData = {
	        images: [options.turretSprite],
	        frames: { width: 30, height: 30 }
	      };
	      var turretSpriteSheet = new createjs.SpriteSheet(turretData);
	      var turret = new createjs.Sprite(turretSpriteSheet);
	
	      tower.on("click", this.newTower.bind(this, options));
	      tower.on("mouseover", this.colorTower.bind(this, towerButton, options.levels[1].cost));
	      tower.on("mouseout", this.decolorTower.bind(this, towerButton));
	
	      tower.addChild(towerButton, turret);
	
	      tower.y = 15;
	      tower.x = offset;
	      tower.cursor = "pointer";
	
	      this.toolbar.addChild(tower);
	    }
	  }, {
	    key: "newTower",
	    value: function newTower(options) {
	      if (options.levels[1].cost <= this.money) {
	        var tower = new _tower2.default(options);
	        this.field.newTower(tower);
	      }
	    }
	  }, {
	    key: "colorTower",
	    value: function colorTower(tower, cost) {
	      if (cost <= this.money) tower.gotoAndPlay("valid");else tower.gotoAndPlay("invalid");
	    }
	  }, {
	    key: "decolorTower",
	    value: function decolorTower(tower) {
	      tower.gotoAndPlay("base");
	    }
	  }, {
	    key: "updateMoney",
	    value: function updateMoney() {
	      var moneyBox = this.toolbar.getChildByName("money-box");
	
	      if (moneyBox.text != this.money) {
	        moneyBox.text = this.money;
	      }
	    }
	  }, {
	    key: "updateLives",
	    value: function updateLives() {
	      var livesBox = this.toolbar.getChildByName("lives-box");
	
	      if (livesBox.text != this.lives) {
	        livesBox.text = this.lives;
	      }
	    }
	  }, {
	    key: "updateTowerInfo",
	    value: function updateTowerInfo() {
	      var towerInfo = this.toolbar.getChildByName("tower-info");
	
	      if (this.field.activeTower !== null) {
	        var towerOptions = this.field.activeTower.towerOptions();
	        towerInfo.text = towerOptions.damage.toFixed(1) + " - Damage\n" + (towerOptions.rateOfFire / 1000).toFixed(1) + "  - Fire Rate\n" + towerOptions.cost.toFixed(1) + " - Cost";
	      } else towerInfo.text = "";
	    }
	  }, {
	    key: "updateWaves",
	    value: function updateWaves() {
	      var waveBox = this.toolbar.getChildByName("next-wave");
	      var wave = this.waves[this.stageNum];
	
	      if (wave === undefined) return;
	
	      var time = new Date().getTime();
	      var timePercent = 1 - (time - this.lastSpawn) / wave.time;
	      var barWidth = 480 * timePercent;
	      waveBox.graphics.clear().beginFill("Yellow").drawRect(0, 58, barWidth, 2).endFill();
	    }
	  }]);
	
	  return Board;
	}();
	
	exports.default = Board;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _gameobject = __webpack_require__(10);
	
	var _gameobject2 = _interopRequireDefault(_gameobject);
	
	var _projectile = __webpack_require__(3);
	
	var _projectile2 = _interopRequireDefault(_projectile);
	
	var _merge = __webpack_require__(12);
	
	var _merge2 = _interopRequireDefault(_merge);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var defaults = {
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
	};
	
	var Tower = function (_GameObject) {
	  _inherits(Tower, _GameObject);
	
	  function Tower() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var createProjectile = arguments[1];
	
	    _classCallCheck(this, Tower);
	
	    var _this = _possibleConstructorReturn(this, (Tower.__proto__ || Object.getPrototypeOf(Tower)).call(this, (0, _merge2.default)({}, defaults, options)));
	
	    _this.active = false;
	    _this.valid = false;
	    _this.lastShot = 0;
	
	    _this.targets = {};
	
	    _this.elements = _this.towerContainer();
	    _this.createProjectile = createProjectile;
	
	    _this.level = 1;
	    _this.revealRadius();
	
	    return _this;
	  }
	
	  _createClass(Tower, [{
	    key: "getTower",
	    value: function getTower() {
	      return this.elements.getChildByName("tower");
	    }
	  }, {
	    key: "towerContainer",
	    value: function towerContainer() {
	      var towerContainer = new createjs.Container();
	
	      var tower = this.towerSprite();
	      var turret = this.turretSprite();
	      var levels = this.levelSprite();
	      var radius = new createjs.Shape();
	
	      towerContainer.cursor = "pointer";
	
	      turret.regX = this.options.width / 2;
	      turret.regY = this.options.height / 2;
	
	      tower.regX = this.options.width / 2;
	      tower.regY = this.options.height / 2;
	
	      radius.regX = this.options.width / 2;
	      radius.regY = this.options.height / 2;
	
	      levels.x = 4 - this.options.width / 2;
	      levels.y = 0 - this.options.height / 2;
	
	      tower.name = "tower";
	      turret.name = "turret";
	      radius.name = "radius";
	      levels.name = "levels";
	
	      towerContainer.mouseChildren = false;
	
	      towerContainer.on("click", this.revealRadius.bind(this));
	      towerContainer.on("mouseout", this.hideRadius.bind(this));
	
	      towerContainer.addChild(tower, turret, radius, levels);
	
	      return towerContainer;
	    }
	  }, {
	    key: "upgrade",
	    value: function upgrade() {
	      var nextLevel = this.options.levels[this.level + 1];
	
	      if (nextLevel) {
	        this.level += 1;
	        var level = this.elements.getChildByName("levels");
	        level.gotoAndPlay(nextLevel.animation);
	      }
	    }
	  }, {
	    key: "towerOptions",
	    value: function towerOptions() {
	      return this.options.levels[this.level];
	    }
	  }, {
	    key: "upgradeCost",
	    value: function upgradeCost() {
	      var nextLevel = this.options.levels[this.level + 1];
	
	      if (nextLevel) return nextLevel.cost;
	
	      return -1;
	    }
	  }, {
	    key: "levelSprite",
	    value: function levelSprite() {
	      var data = {
	        images: ['./assets/levels.png'],
	        frames: { width: 22, height: 4, count: 4, spacing: 0, margin: 0 },
	        animations: {
	          "level-1": {
	            frames: [0]
	          },
	          "level-2": {
	            frames: [1]
	          },
	          "level-3": {
	            frames: [2]
	          },
	          "level-4": {
	            frames: [3]
	          }
	        }
	      };
	      var spriteSheet = new createjs.SpriteSheet(data);
	      var level = new createjs.Sprite(spriteSheet, "level-1");
	
	      return level;
	    }
	  }, {
	    key: "towerSprite",
	    value: function towerSprite() {
	      var data = {
	        images: ['./assets/tower.png'],
	        frames: { width: 30, height: 30, count: 3, spacing: 0, margin: 0 },
	        animations: {
	          base: {
	            frames: [0]
	          },
	          valid: {
	            frames: [1]
	          },
	          invalid: {
	            frames: [2]
	          }
	        }
	      };
	      var spriteSheet = new createjs.SpriteSheet(data);
	      var tower = new createjs.Sprite(spriteSheet);
	
	      return tower;
	    }
	  }, {
	    key: "turretSprite",
	    value: function turretSprite() {
	      var data = {
	        images: [this.options.turretSprite],
	        frames: { width: 30, height: 30 }
	      };
	      var spriteSheet = new createjs.SpriteSheet(data);
	      var turret = new createjs.Sprite(spriteSheet);
	
	      return turret;
	    }
	  }, {
	    key: "drawValidTower",
	    value: function drawValidTower() {
	      var tower = this.elements.getChildByName("tower");
	      tower.gotoAndPlay("valid");
	    }
	  }, {
	    key: "drawInValidTower",
	    value: function drawInValidTower() {
	      var tower = this.elements.getChildByName("tower");
	      tower.gotoAndPlay("invalid");
	    }
	  }, {
	    key: "drawRadius",
	    value: function drawRadius() {
	      var radius = this.elements.getChildByName("radius");
	
	      radius.graphics.clear().beginStroke("Yellow").setStrokeStyle(3).drawCircle(this.options.width / 2, this.options.height / 2, this.options.levels[this.level].radius).endStroke();
	    }
	  }, {
	    key: "removeRadius",
	    value: function removeRadius() {
	      var radius = this.elements.getChildByName("radius");
	
	      radius.graphics.clear();
	    }
	  }, {
	    key: "targetMinion",
	    value: function targetMinion(minions) {
	      var _this2 = this;
	
	      var towerX = this.elements.x + 15;
	      var towerY = this.elements.y + 15;
	      var possibleTargets = Object.keys(minions);
	
	      if (this.options.levels[this.level].numTargets === 0) {
	        var _ret = function () {
	          var targets = [];
	          possibleTargets.forEach(function (minion) {
	            var minionX = minions[minion].elements.x + 15 / 2;
	            var minionY = minions[minion].elements.y + 15 / 2;
	
	            if (Math.hypot(towerX - minionX, towerY - minionY) < _this2.options.levels[_this2.level].radius) {
	              targets.push(minions[minion]);
	            }
	          });
	          var time = new Date().getTime();
	          if (_this2.lastShot + _this2.options.levels[_this2.level].rateOfFire < time) {
	            _this2.groundAttack(targets);
	            _this2.lastShot = time;
	          }
	
	          return {
	            v: void 0
	          };
	        }();
	
	        if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
	      }
	
	      /* Check old targets to see if they are still in range */
	      var oldTargets = Object.keys(this.targets);
	      oldTargets.forEach(function (oldTarget) {
	        var minionX = _this2.targets[oldTarget].elements.x + 15 / 2;
	        var minionY = _this2.targets[oldTarget].elements.y + 15 / 2;
	        if (Math.hypot(towerX - minionX, towerY - minionY) > _this2.options.levels[_this2.level].radius || _this2.targets[oldTarget].health < 0) {
	          // Remove old target if theyve moved out of range
	          delete _this2.targets[oldTarget];
	        }
	      });
	
	      var curTargeted = Object.keys(this.targets).length;
	
	      possibleTargets.forEach(function (target) {
	        if (curTargeted < _this2.options.levels[_this2.level].numTargets) {
	          var minionX = minions[target].elements.x + 15 / 2;
	          var minionY = minions[target].elements.y + 15 / 2;
	
	          if (Math.hypot(towerX - minionX, towerY - minionY) < _this2.options.levels[_this2.level].radius) {
	            if (_this2.targets[target] === undefined) {
	              _this2.targets[target] = minions[target];
	              curTargeted++;
	            }
	          }
	        }
	      });
	
	      var aimTarget = Object.values(this.targets);
	
	      if (aimTarget.length > 0) {
	        // Aim the turret at a minion
	        var minionX = aimTarget[0].elements.x + 15 / 2;
	        var minionY = aimTarget[0].elements.y + 15 / 2;
	
	        this.aimTurret(minionX, minionY);
	        var time = new Date().getTime();
	        if (this.lastShot + this.options.levels[this.level].rateOfFire < time) {
	          this.shootTurret(aimTarget);
	          this.lastShot = time;
	        }
	      }
	    }
	  }, {
	    key: "groundAttack",
	    value: function groundAttack(minions) {
	      var _this3 = this;
	
	      if (minions.length === 0) return;
	
	      var data = {
	        images: ['./assets/groundattack.png'],
	        frames: { width: 100, height: 100, count: 6, regX: 50, regY: 50, spacing: 0, margin: 0 },
	        animations: {
	          animate: [0, 6, "animate", .5]
	        }
	      };
	      var spriteSheet = new createjs.SpriteSheet(data);
	      var explosion = new createjs.Sprite(spriteSheet, "animate");
	      explosion.name = "explosion";
	
	      explosion.addEventListener("animationend", this.removeExplosion.bind(this));
	      this.elements.addChild(explosion);
	      this.elements.setChildIndex(explosion, 0);
	
	      minions.forEach(function (minion) {
	        minion.damageMinion(_this3.options.levels[_this3.level].damage);
	      });
	    }
	  }, {
	    key: "removeExplosion",
	    value: function removeExplosion() {
	      var explosion = this.elements.getChildByName("explosion");
	      this.elements.removeChild(explosion);
	    }
	  }, {
	    key: "shootTurret",
	    value: function shootTurret(minions) {
	      var _this4 = this;
	
	      minions.forEach(function (minion) {
	        var options = {
	          target: minion,
	          speed: 5,
	          damage: _this4.options.levels[_this4.level].damage
	        };
	
	        if (_this4.options.bulletSprite) options["sprite"] = _this4.options.bulletSprite;
	
	        var projectile = new _projectile2.default(options);
	        projectile.elements.x = _this4.elements.x;
	        projectile.elements.y = _this4.elements.y;
	        _this4.createProjectile(projectile);
	      });
	    }
	  }, {
	    key: "aimTurret",
	    value: function aimTurret(x, y) {
	      var turret = this.elements.getChildByName("turret");
	
	      var targetCoord = {
	        x: x,
	        y: y
	      };
	
	      turret.rotation = this.getAngleTo(targetCoord) - 90;
	    }
	  }, {
	    key: "setPos",
	    value: function setPos(x, y) {
	      this.elements.x = x;
	      this.elements.y = y;
	    }
	  }, {
	    key: "invalidPosition",
	    value: function invalidPosition() {
	      if (this.valid) {
	        this.drawInValidTower();
	        this.drawRadius();
	        this.valid = false;
	      }
	    }
	  }, {
	    key: "validPosition",
	    value: function validPosition() {
	      if (!this.valid) {
	        this.drawValidTower();
	        this.hideRadius();
	        this.valid = true;
	      }
	    }
	  }, {
	    key: "revealRadius",
	    value: function revealRadius() {
	      this.drawRadius();
	    }
	  }, {
	    key: "hideRadius",
	    value: function hideRadius() {
	      if (this.active) {
	        this.removeRadius();
	      }
	    }
	  }, {
	    key: "activate",
	    value: function activate() {
	      this.active = true;
	      var tower = this.elements.getChildByName("tower");
	      tower.gotoAndPlay("base");
	    }
	  }]);
	
	  return Tower;
	}(_gameobject2.default);
	
	exports.default = Tower;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _gameobject = __webpack_require__(10);
	
	var _gameobject2 = _interopRequireDefault(_gameobject);
	
	var _merge = __webpack_require__(12);
	
	var _merge2 = _interopRequireDefault(_merge);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var defaults = {
	  sprite: './assets/plasma2.png',
	  target: {},
	  speed: 1,
	  damage: 10,
	  animation: "bullet",
	  width: 10,
	  height: 10
	};
	
	var Projectile = function (_GameObject) {
	  _inherits(Projectile, _GameObject);
	
	  function Projectile() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	    _classCallCheck(this, Projectile);
	
	    var _this = _possibleConstructorReturn(this, (Projectile.__proto__ || Object.getPrototypeOf(Projectile)).call(this, (0, _merge2.default)({}, defaults, options)));
	
	    _this.active = true;
	
	    _this.elements = _this.projectileSprite();
	    return _this;
	  }
	
	  _createClass(Projectile, [{
	    key: "beginRemove",
	    value: function beginRemove(callback) {
	      this.active = false;
	      this.elements.removeAllChildren();
	      this.elements.addChild(this.explosionSprite(callback));
	    }
	  }, {
	    key: "endRemove",
	    value: function endRemove(callback) {
	      callback();
	    }
	  }, {
	    key: "explosionSprite",
	    value: function explosionSprite(callback) {
	      var data = {
	        images: ['./assets/explosion.png'],
	        frames: { width: 32, height: 32, count: 16, regX: 16, regY: 16, spacing: 0, margin: 0 },
	        animations: {
	          animate: [0, 15, "animate", .5]
	        }
	      };
	      var spriteSheet = new createjs.SpriteSheet(data);
	      var explosion = new createjs.Sprite(spriteSheet, "animate");
	
	      explosion.addEventListener("animationend", callback);
	
	      return explosion;
	    }
	  }, {
	    key: "projectileSprite",
	    value: function projectileSprite() {
	      var data = {
	        images: [this.options.sprite],
	        frames: { width: 10, height: 20 }
	      };
	      var spriteSheet = new createjs.SpriteSheet(data);
	      var projectile = new createjs.Sprite(spriteSheet);
	
	      projectile.regX = 5;
	      projectile.regY = 5;
	
	      var projectileContainer = new createjs.Container();
	      projectileContainer.addChild(projectile);
	
	      return projectileContainer;
	    }
	  }, {
	    key: "moveProjectile",
	    value: function moveProjectile() {
	
	      if (!this.active) return false;
	
	      var targetCoord = {
	        x: this.options.target.elements.x,
	        y: this.options.target.elements.y
	      };
	
	      var angle = this.getAngleTo(targetCoord);
	      var vector = this.getVectorOf(angle);
	
	      this.elements.rotation = angle - 90;
	
	      this.elements.y += vector.y * this.options.speed;
	      this.elements.x += vector.x * this.options.speed;
	
	      if (this.intersects(this.options.target)) {
	        this.options.target.damageMinion(this.options.damage);
	        return true;
	      }
	
	      return false;
	    }
	  }]);
	
	  return Projectile;
	}(_gameobject2.default);
	
	exports.default = Projectile;

/***/ },
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _field_utils = __webpack_require__(11);
	
	var Util = _interopRequireWildcard(_field_utils);
	
	var _pathfinder = __webpack_require__(8);
	
	var _pathfinder2 = _interopRequireDefault(_pathfinder);
	
	var _merge = __webpack_require__(12);
	
	var _merge2 = _interopRequireDefault(_merge);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Field = function () {
	  function Field() {
	    var rows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 14;
	    var cols = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 14;
	
	    _classCallCheck(this, Field);
	
	    this.elements = new createjs.Container();
	
	    this.towers = {};
	    this.minions = {};
	    this.projectiles = {};
	
	    this.activeTower = null;
	
	    this.generateField();
	
	    this.minionId = 0;
	    this.projectileId = 0;
	    this.towerId = 0;
	
	    this.virtualBoard = new _pathfinder2.default();
	
	    this.goalX = 15;
	    this.goalY = 31;
	
	    this.virtualBoard.findPath(this.goalX, this.goalY);
	
	    this.minionKilled = function () {};
	    this.minionReachedEnd = function () {};
	
	    this.elements.on("click", this.selectTower.bind(this));
	    this.elements.on("mouseover", this.showRadius.bind(this));
	  }
	
	  _createClass(Field, [{
	    key: "upgradeTower",
	    value: function upgradeTower() {
	      this.activeTower.upgrade();
	    }
	  }, {
	    key: "selectTower",
	    value: function selectTower(e) {
	      if (e.target.name === null) {
	        return;
	      }
	
	      if (this.activeTower !== null) {
	        if (!this.activeTower.active) return;
	      }
	
	      if (e.target.name.substring(0, 5) === "tower") {
	        var tower = this.towers[e.target.name];
	
	        if (tower === undefined) return;
	
	        tower.drawValidTower();
	        if (this.activeTower !== null) {
	          if (!this.activeTower.active) return;else {
	            if (this.activeTower.elements.name !== tower.elements.name) this.activeTower.activate();
	          }
	        }
	
	        this.activeTower = tower;
	      } else {
	        if (this.activeTower !== null) {
	          if (this.activeTower.active) this.activeTower.activate();
	
	          this.activeTower = null;
	        }
	      }
	    }
	  }, {
	    key: "showRadius",
	    value: function showRadius(e) {
	      if (e.target.name === null) return;
	
	      if (e.target.name.substring(0, 5) === "tower") {
	        var tower = this.towers[e.target.name];
	
	        if (tower === undefined) return;
	
	        this.towers[e.target.name].drawRadius();
	      }
	    }
	  }, {
	    key: "generateField",
	    value: function generateField() {
	      var field = this.fieldSprite();
	      field.name = "field";
	      this.elements.addChild(field);
	    }
	  }, {
	    key: "fieldSprite",
	    value: function fieldSprite() {
	      var data = {
	        images: ['./assets/fieldborder.png'],
	        frames: { width: 480, height: 480 }
	      };
	      var spriteSheet = new createjs.SpriteSheet(data);
	      var field = new createjs.Sprite(spriteSheet);
	
	      return field;
	    }
	  }, {
	    key: "rotateTurrets",
	    value: function rotateTurrets() {
	      var _this = this;
	
	      Object.values(this.towers).forEach(function (tower) {
	        tower.targetMinion(_this.minions);
	      });
	    }
	  }, {
	    key: "moveMinions",
	    value: function moveMinions() {
	      var _this2 = this;
	
	      var minions = Object.keys(this.minions);
	
	      minions.forEach(function (key) {
	        if (_this2.minions[key].health <= 0) {
	          _this2.minionKilled(_this2.killMinion(key));
	        } else {
	          _this2.setMinionPath(key);
	        }
	      });
	    }
	  }, {
	    key: "setMinionPath",
	    value: function setMinionPath(minionId) {
	      var minion = this.minions[minionId];
	      var minionCoord = minion.fieldToGrid();
	      var minionTarget = this.virtualBoard.getPathToCoord(minionCoord.x, minionCoord.y, 15, 31);
	
	      if (!minion.moveMinion(minionTarget)) {
	        this.minionReachedEnd();
	        this.killMinion(minionId);
	      }
	    }
	  }, {
	    key: "createMinion",
	    value: function createMinion(minion) {
	      var name = "minion-" + this.minionId;
	
	      minion.setPath(this.virtualBoard);
	      this.minions[name] = minion;
	      minion.elements.name = name;
	      minion.elements.x = 180 + Math.random() * 120;
	      minion.elements.y = 0;
	
	      this.elements.addChild(minion.elements);
	      this.minionId++;
	    }
	  }, {
	    key: "killMinion",
	    value: function killMinion(minionId) {
	      var reward = this.minions[minionId].options.reward;
	      var minionEl = this.elements.getChildByName(minionId);
	      this.elements.removeChild(minionEl);
	      delete this.minions[minionId];
	      return reward;
	    }
	  }, {
	    key: "removeMinion",
	    value: function removeMinion(minionId) {}
	  }, {
	    key: "moveProjectiles",
	    value: function moveProjectiles() {
	      var _this3 = this;
	
	      var projectiles = Object.keys(this.projectiles);
	
	      projectiles.forEach(function (key) {
	        if (_this3.projectiles[key].moveProjectile()) {
	          _this3.destroyProjectile(key);
	        }
	      });
	    }
	  }, {
	    key: "destroyProjectile",
	    value: function destroyProjectile(projectileId) {
	      var projectileEl = this.projectiles[projectileId];
	      projectileEl.beginRemove(this.removeProjectile.bind(this, projectileId));
	    }
	  }, {
	    key: "removeProjectile",
	    value: function removeProjectile(projectileId) {
	      var projectileEl = this.elements.getChildByName(projectileId);
	      this.elements.removeChild(projectileEl);
	      delete this.projectiles[projectileId];
	    }
	  }, {
	    key: "createProjectile",
	    value: function createProjectile(projectile) {
	      var name = "proj-" + this.projectileId;
	      this.projectiles[name] = projectile;
	      projectile.elements.name = name;
	      this.elements.addChild(projectile.elements);
	
	      this.projectileId++;
	    }
	  }, {
	    key: "newTower",
	    value: function newTower(tower) {
	      var name = "tower-" + this.towerId;
	      tower.elements.name = name;
	      this.towerId++;
	
	      if (this.activeTower !== null) {
	        if (!this.activeTower.active) {
	          var towerEl = this.elements.getChildByName(this.activeTower.elements.name);
	          this.elements.removeChild(towerEl);
	        } else {
	          this.activeTower.activate();
	        }
	        this.activeTower = null;
	      }
	
	      tower.createProjectile = this.createProjectile.bind(this);
	      this.activeTower = tower;
	      this.elements.addChild(this.activeTower.elements);
	      this.elements.setChildIndex(tower, this.elements.getNumChildren() - 1);
	    }
	  }, {
	    key: "placeTower",
	    value: function placeTower() {
	      if (this.activeTower === null) return false;
	
	      if (this.validTowerPos()) return false;
	
	      var virtualBoardCopy = this.virtualBoard.dupBoard();
	
	      var newX = this.fieldToGrid(this.activeTower.elements.x);
	      var newY = this.fieldToGrid(this.activeTower.elements.y);
	
	      virtualBoardCopy.update(newX, newY);
	
	      virtualBoardCopy.findPath(this.goalX, this.goalY);
	
	      if (virtualBoardCopy.getPathToCoord(16, 0, this.goalX, this.goalY) === undefined) {
	        console.log("Blocking");
	        return false;
	      } else {
	        var cost = this.activeTower.options.levels[1].cost;
	        this.virtualBoard = virtualBoardCopy;
	        this.activeTower.active = true;
	
	        this.towers[this.activeTower.elements.name] = this.activeTower;
	        return cost;
	      }
	    }
	  }, {
	    key: "fieldToGrid",
	    value: function fieldToGrid(x) {
	      // x -= 30;
	      x /= 15;
	
	      return Math.floor(x);
	    }
	  }, {
	    key: "checkValidTower",
	    value: function checkValidTower() {
	      if (this.activeTower === null) return;
	
	      if (this.activeTower.active) return;
	
	      if (this.validTowerPos()) {
	        this.activeTower.invalidPosition();
	      } else {
	        this.activeTower.validPosition();
	      }
	    }
	  }, {
	    key: "validTowerPos",
	    value: function validTowerPos() {
	      var _this4 = this;
	
	      var minionIntersect = !Object.values(this.minions).every(function (minion) {
	        return !_this4.activeTower.intersects(minion);
	      });
	      return minionIntersect || !Object.values(this.towers).every(function (tower) {
	        return !_this4.activeTower.intersects(tower);
	      });
	    }
	  }, {
	    key: "mouseMove",
	    value: function mouseMove(e) {
	      var x = e.stageX - this.elements.x;
	      var y = e.stageY - this.elements.y;
	
	      if (this.activeTower === null) return;
	
	      if (this.activeTower.active) return;
	
	      var newPos = Util.cursorToFieldPos(x, y);
	      this.activeTower.setPos(newPos.x, newPos.y);
	    }
	  }]);
	
	  return Field;
	}();
	
	exports.default = Field;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var PathFinder = function () {
	  function PathFinder(grid) {
	    _classCallCheck(this, PathFinder);
	
	    this.grid = grid || this.createGrid();
	    this.frontier = [];
	    this.came_from = {};
	  }
	
	  _createClass(PathFinder, [{
	    key: "markWall",
	    value: function markWall(x, y) {
	      this.grid[y][x].markWall();
	    }
	  }, {
	    key: "dupBoard",
	    value: function dupBoard() {
	      var board = [];
	      for (var i = 0; i < 32; i++) {
	        board[i] = [];
	        for (var j = 0; j < 32; j++) {
	
	          board[i][j] = new PathNode(j, i);
	          board[i][j].wall = this.grid[i][j].wall;
	        }
	      }
	
	      return new PathFinder(board);
	    }
	  }, {
	    key: "printBoard",
	    value: function printBoard() {
	      for (var i = 0; i < 32; i++) {
	        var row = this.grid[i].map(function (a) {
	          if (a.wall) return "X";else return "-";
	        });
	
	        console.log(i, row.join(""));
	      }
	    }
	  }, {
	    key: "update",
	    value: function update(x, y) {
	      this.markWall(x - 1, y - 1);
	      this.markWall(x, y - 1);
	      this.markWall(x - 1, y);
	      this.markWall(x, y);
	    }
	  }, {
	    key: "createGrid",
	    value: function createGrid() {
	      var board = [];
	      for (var i = 0; i < 32; i++) {
	        board[i] = [];
	        for (var j = 0; j < 32; j++) {
	
	          board[i][j] = new PathNode(j, i);
	          if ((i === 0 || i === 31 || j === 0 || j === 31 || i === 1 || i === 30 || j === 1 || j === 30) && (j > 19 || j < 12)) {
	            board[i][j].wall = true;
	          }
	        }
	      }
	      // for(let i = 0; i < 32; i++) {
	      //   let row = board[i].map((a) => {
	      //     if(a.wall)
	      //       return "X";
	      //     else
	      //       return "-";
	      //   });
	      //
	      //   console.log(i, row.join(""));
	      // }
	      return board;
	    }
	  }, {
	    key: "findPath",
	    value: function findPath(endX, endY) {
	      var _this = this;
	
	      var startEl = this.grid[endY][endX];
	      this.came_from = {};
	      this.frontier.push(startEl);
	      this.came_from[startEl.toString()] = null;
	
	      var _loop = function _loop() {
	        var curEl = _this.frontier.shift(1);
	        var next = _this.neighbors(curEl);
	
	        next.forEach(function (el) {
	          _this.came_from[el.toString()] = curEl;
	          _this.frontier.push(el);
	        });
	      };
	
	      while (this.frontier.length > 0) {
	        _loop();
	      }
	    }
	  }, {
	    key: "getPathToCoord",
	    value: function getPathToCoord(startX, startY, endX, endY) {
	      if (!(startX >= 0 && startX < 32 && startY >= 0 && startY < 32 && endX >= 0 && endX < 32 && endY >= 0 && endY < 32)) return { x: endX, y: endY };
	
	      // this.findPath(startX, startY, endX, endY);
	
	
	      var startCoord = this.grid[endY][endX];
	      var endCoord = this.grid[startY][startX];
	      var curCoord = this.came_from[endCoord.toString()];
	      var path = [];
	      var path1 = {};
	
	      // console.log(endCoord);
	      // console.log(endCoord, curCoord, startCoord);
	      return curCoord;
	
	      // while(curCoord !== null) {
	      //   if(curCoord === undefined)
	      //     return false;
	      //
	      //
	      //   path1[curCoord.toString()] = this.came_from[curCoord.toString()];
	      //   path.push(curCoord)
	      //   curCoord = this.came_from[curCoord.toString()];
	      // }
	
	      // console.log(curCoord);
	
	
	      // for(let i = 0; i < 32; i++) {
	      //   let row = this.grid[i].map((a) => {
	      //     if(a.wall)
	      //       return "X";
	      //     else if(path1[a.toString()] !== undefined) {
	      //       return "P";
	      //     }
	      //     else
	      //       return "-";
	      //   });
	      //
	      //   console.log(i, row.join(""));
	      // }
	
	      return this.came_from[endCoord.toString()];
	
	      // return path1;
	    }
	  }, {
	    key: "neighbors",
	    value: function neighbors(el) {
	      var _this2 = this;
	
	      var deltas = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
	      var elements = [];
	
	      deltas.forEach(function (delta) {
	        var newX = delta.x + el.x;
	        var newY = delta.y + el.y;
	
	        if (newX >= 0 && newX < 32 && newY >= 0 && newY < 32) {
	          var _curEl = _this2.grid[newY][newX];
	
	          if (!_curEl.wall && _this2.came_from[_curEl.toString()] === undefined) {
	            elements.push(_curEl);
	          }
	        }
	      });
	      return elements;
	    }
	  }]);
	
	  return PathFinder;
	}();
	
	exports.default = PathFinder;
	
	var PathNode = function () {
	  function PathNode(x, y) {
	    _classCallCheck(this, PathNode);
	
	    this.x = x;
	    this.y = y;
	    this.wall = false;
	  }
	
	  _createClass(PathNode, [{
	    key: "markWall",
	    value: function markWall() {
	      this.wall = true;
	    }
	  }, {
	    key: "toString",
	    value: function toString() {
	      return this.x + "-" + this.y;
	    }
	  }]);

	  return PathNode;
	}();

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _gameobject = __webpack_require__(10);
	
	var _gameobject2 = _interopRequireDefault(_gameobject);
	
	var _merge = __webpack_require__(12);
	
	var _merge2 = _interopRequireDefault(_merge);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var defaults = {
	  minionSprite: './assets/minion.png',
	  speed: 1,
	  health: 100,
	  reward: 10,
	  height: 15,
	  width: 15
	};
	
	var Minion = function (_GameObject) {
	  _inherits(Minion, _GameObject);
	
	  function Minion() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	    _classCallCheck(this, Minion);
	
	    var _this = _possibleConstructorReturn(this, (Minion.__proto__ || Object.getPrototypeOf(Minion)).call(this, (0, _merge2.default)({}, defaults, options)));
	
	    _this.elements = _this.minionSprite();
	
	    _this.health = _this.options.health;
	    _this.baseHealth = _this.options.health;
	    _this.speed = _this.options.speed;
	    _this.path = {};
	
	    _this.drawHealth();
	    return _this;
	  }
	
	  _createClass(Minion, [{
	    key: "setPath",
	    value: function setPath(path) {
	      this.path = path;
	    }
	  }, {
	    key: "moveMinion",
	    value: function moveMinion(target) {
	      if (target === null || target === undefined) {
	        return false;
	      }
	
	      var targetCoord = {
	        x: target.x * 15 + 7.5,
	        y: target.y * 15 + 7.5
	      };
	
	      var angle = this.getAngleTo(targetCoord);
	      var vector = this.getVectorOf(angle);
	
	      this.elements.rotation = angle - 90;
	
	      this.elements.y += vector.y * this.speed;
	      this.elements.x += vector.x * this.speed;
	
	      return true;
	    }
	  }, {
	    key: "drawHealth",
	    value: function drawHealth() {
	      var healthPercent = this.health / this.baseHealth;
	      var healthAngle = healthPercent * 2 * Math.PI;
	      var healthCircle = this.elements.getChildByName("health");
	
	      healthCircle.graphics.clear().beginFill("Green").arc(0, 0, 9, 0, healthAngle).closePath();
	      healthCircle.regX = -7.5;
	      healthCircle.regY = -7.5;
	
	      this.elements.setChildIndex(healthCircle, 1);
	    }
	  }, {
	    key: "damageMinion",
	    value: function damageMinion(damage) {
	      this.health -= damage;
	
	      this.drawHealth();
	
	      return this.health;
	    }
	  }, {
	    key: "minionSprite",
	    value: function minionSprite() {
	      var data = {
	        images: ['./assets/minion.png'],
	        frames: { width: 15, height: 15 }
	      };
	      var spriteSheet = new createjs.SpriteSheet(data);
	      var minion = new createjs.Sprite(spriteSheet);
	
	      var minionContainer = new createjs.Container();
	      var healthCircle = new createjs.Shape();
	      var redCircle = new createjs.Shape();
	
	      redCircle.graphics.beginFill("Red").drawCircle(0, 0, 9).endFill();
	
	      healthCircle.name = "health";
	
	      redCircle.regX = -7.5;
	      redCircle.regY = -7.5;
	      minionContainer.regX = 15 / 2;
	      minionContainer.regY = 15 / 2;
	
	      minionContainer.addChild(minion, healthCircle, redCircle);
	      minionContainer.setChildIndex(redCircle, 0);
	
	      return minionContainer;
	    }
	  }]);
	
	  return Minion;
	}(_gameobject2.default);
	
	exports.default = Minion;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _field_utils = __webpack_require__(11);
	
	var Util = _interopRequireWildcard(_field_utils);
	
	var _merge = __webpack_require__(12);
	
	var _merge2 = _interopRequireDefault(_merge);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var defaults = {
	  width: 30,
	  height: 30
	};
	
	var GameObject = function () {
	  function GameObject() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	    _classCallCheck(this, GameObject);
	
	    this.options = (0, _merge2.default)({}, defaults, options);
	
	    this.elements = this.generateSprite();
	  }
	
	  _createClass(GameObject, [{
	    key: "generateSprite",
	    value: function generateSprite() {}
	
	    // begin death animation
	
	  }, {
	    key: "beginRemove",
	    value: function beginRemove() {}
	
	    //remove object
	
	  }, {
	    key: "endRemove",
	    value: function endRemove() {}
	  }, {
	    key: "getCenterCoord",
	    value: function getCenterCoord() {
	      return {
	        x: this.elements.x + this.options.width / 2,
	        y: this.elements.y + this.options.height / 2
	      };
	    }
	  }, {
	    key: "getAngleTo",
	    value: function getAngleTo(object) {
	      if (object === undefined) return 90;
	
	      var thisCenter = {
	        x: this.elements.x,
	        y: this.elements.y
	      };
	
	      var x = object.x - thisCenter.x;
	      var y = object.y - thisCenter.y;
	
	      var angle = Util.toDegrees(Math.atan(y / x));
	
	      if (thisCenter.x > object.x) angle = angle + 180;
	
	      return angle;
	    }
	  }, {
	    key: "getVectorOf",
	    value: function getVectorOf(angle) {
	      var rads = Util.toRadians(angle);
	
	      return {
	        x: Math.cos(rads),
	        y: Math.sin(rads)
	      };
	    }
	  }, {
	    key: "fieldToGrid",
	    value: function fieldToGrid() {
	      var x = this.elements.x / this.options.width;
	      var y = this.elements.y / this.options.height;
	
	      return {
	        x: Math.floor(x),
	        y: Math.floor(y)
	      };
	    }
	  }, {
	    key: "intersects",
	    value: function intersects(object) {
	      return this.elements.x < object.elements.x + object.options.width && object.elements.x < this.elements.x + this.options.width && this.elements.y < object.elements.y + object.options.height && object.elements.y < this.elements.y + this.options.height;
	    }
	  }]);
	
	  return GameObject;
	}();
	
	exports.default = GameObject;

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.toDegrees = toDegrees;
	exports.toRadians = toRadians;
	exports.cursorToFieldPos = cursorToFieldPos;
	function toDegrees(angle) {
	  return angle * (180 / Math.PI);
	}
	
	function toRadians(angle) {
	  return angle * (Math.PI / 180);
	}
	
	function cursorToFieldPos(x, y) {
	  x -= 8;
	  y -= 8;
	
	  var newX = Math.floor((x + 15) / 15) * 15;
	  var newY = Math.floor((y + 15) / 15) * 15;
	
	  newX = newX < 45 ? 45 : newX;
	  newY = newY < 45 ? 45 : newY;
	
	  newX = newX > 450 - 15 ? 450 - 15 : newX;
	  newY = newY > 450 - 15 ? 450 - 15 : newY;
	
	  return { x: newX, y: newY };
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var baseMerge = __webpack_require__(13),
	    createAssigner = __webpack_require__(97);
	
	/**
	 * This method is like `_.assign` except that it recursively merges own and
	 * inherited enumerable string keyed properties of source objects into the
	 * destination object. Source properties that resolve to `undefined` are
	 * skipped if a destination value exists. Array and plain object properties
	 * are merged recursively. Other objects and value types are overridden by
	 * assignment. Source objects are applied from left to right. Subsequent
	 * sources overwrite property assignments of previous sources.
	 *
	 * **Note:** This method mutates `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.5.0
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * var object = {
	 *   'a': [{ 'b': 2 }, { 'd': 4 }]
	 * };
	 *
	 * var other = {
	 *   'a': [{ 'c': 3 }, { 'e': 5 }]
	 * };
	 *
	 * _.merge(object, other);
	 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
	 */
	var merge = createAssigner(function(object, source, srcIndex) {
	  baseMerge(object, source, srcIndex);
	});
	
	module.exports = merge;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Stack = __webpack_require__(14),
	    assignMergeValue = __webpack_require__(58),
	    baseFor = __webpack_require__(61),
	    baseMergeDeep = __webpack_require__(63),
	    isObject = __webpack_require__(38),
	    keysIn = __webpack_require__(91);
	
	/**
	 * The base implementation of `_.merge` without support for multiple sources.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {number} srcIndex The index of `source`.
	 * @param {Function} [customizer] The function to customize merged values.
	 * @param {Object} [stack] Tracks traversed source values and their merged
	 *  counterparts.
	 */
	function baseMerge(object, source, srcIndex, customizer, stack) {
	  if (object === source) {
	    return;
	  }
	  baseFor(source, function(srcValue, key) {
	    if (isObject(srcValue)) {
	      stack || (stack = new Stack);
	      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
	    }
	    else {
	      var newValue = customizer
	        ? customizer(object[key], srcValue, (key + ''), object, source, stack)
	        : undefined;
	
	      if (newValue === undefined) {
	        newValue = srcValue;
	      }
	      assignMergeValue(object, key, newValue);
	    }
	  }, keysIn);
	}
	
	module.exports = baseMerge;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var ListCache = __webpack_require__(15),
	    stackClear = __webpack_require__(23),
	    stackDelete = __webpack_require__(24),
	    stackGet = __webpack_require__(25),
	    stackHas = __webpack_require__(26),
	    stackSet = __webpack_require__(27);
	
	/**
	 * Creates a stack cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Stack(entries) {
	  var data = this.__data__ = new ListCache(entries);
	  this.size = data.size;
	}
	
	// Add methods to `Stack`.
	Stack.prototype.clear = stackClear;
	Stack.prototype['delete'] = stackDelete;
	Stack.prototype.get = stackGet;
	Stack.prototype.has = stackHas;
	Stack.prototype.set = stackSet;
	
	module.exports = Stack;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var listCacheClear = __webpack_require__(16),
	    listCacheDelete = __webpack_require__(17),
	    listCacheGet = __webpack_require__(20),
	    listCacheHas = __webpack_require__(21),
	    listCacheSet = __webpack_require__(22);
	
	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;
	
	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}
	
	// Add methods to `ListCache`.
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype['delete'] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;
	
	module.exports = ListCache;


/***/ },
/* 16 */
/***/ function(module, exports) {

	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
	  this.__data__ = [];
	  this.size = 0;
	}
	
	module.exports = listCacheClear;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(18);
	
	/** Used for built-in method references. */
	var arrayProto = Array.prototype;
	
	/** Built-in value references. */
	var splice = arrayProto.splice;
	
	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);
	
	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  --this.size;
	  return true;
	}
	
	module.exports = listCacheDelete;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var eq = __webpack_require__(19);
	
	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}
	
	module.exports = assocIndexOf;


/***/ },
/* 19 */
/***/ function(module, exports) {

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}
	
	module.exports = eq;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(18);
	
	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);
	
	  return index < 0 ? undefined : data[index][1];
	}
	
	module.exports = listCacheGet;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(18);
	
	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return assocIndexOf(this.__data__, key) > -1;
	}
	
	module.exports = listCacheHas;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(18);
	
	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);
	
	  if (index < 0) {
	    ++this.size;
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}
	
	module.exports = listCacheSet;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var ListCache = __webpack_require__(15);
	
	/**
	 * Removes all key-value entries from the stack.
	 *
	 * @private
	 * @name clear
	 * @memberOf Stack
	 */
	function stackClear() {
	  this.__data__ = new ListCache;
	  this.size = 0;
	}
	
	module.exports = stackClear;


/***/ },
/* 24 */
/***/ function(module, exports) {

	/**
	 * Removes `key` and its value from the stack.
	 *
	 * @private
	 * @name delete
	 * @memberOf Stack
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function stackDelete(key) {
	  var data = this.__data__,
	      result = data['delete'](key);
	
	  this.size = data.size;
	  return result;
	}
	
	module.exports = stackDelete;


/***/ },
/* 25 */
/***/ function(module, exports) {

	/**
	 * Gets the stack value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Stack
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function stackGet(key) {
	  return this.__data__.get(key);
	}
	
	module.exports = stackGet;


/***/ },
/* 26 */
/***/ function(module, exports) {

	/**
	 * Checks if a stack value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Stack
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function stackHas(key) {
	  return this.__data__.has(key);
	}
	
	module.exports = stackHas;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var ListCache = __webpack_require__(15),
	    Map = __webpack_require__(28),
	    MapCache = __webpack_require__(43);
	
	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;
	
	/**
	 * Sets the stack `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Stack
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the stack cache instance.
	 */
	function stackSet(key, value) {
	  var data = this.__data__;
	  if (data instanceof ListCache) {
	    var pairs = data.__data__;
	    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
	      pairs.push([key, value]);
	      this.size = ++data.size;
	      return this;
	    }
	    data = this.__data__ = new MapCache(pairs);
	  }
	  data.set(key, value);
	  this.size = data.size;
	  return this;
	}
	
	module.exports = stackSet;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(29),
	    root = __webpack_require__(34);
	
	/* Built-in method references that are verified to be native. */
	var Map = getNative(root, 'Map');
	
	module.exports = Map;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsNative = __webpack_require__(30),
	    getValue = __webpack_require__(42);
	
	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = getValue(object, key);
	  return baseIsNative(value) ? value : undefined;
	}
	
	module.exports = getNative;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(31),
	    isMasked = __webpack_require__(39),
	    isObject = __webpack_require__(38),
	    toSource = __webpack_require__(41);
	
	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
	
	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);
	
	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject(value) || isMasked(value)) {
	    return false;
	  }
	  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource(value));
	}
	
	module.exports = baseIsNative;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(32),
	    isObject = __webpack_require__(38);
	
	/** `Object#toString` result references. */
	var asyncTag = '[object AsyncFunction]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    proxyTag = '[object Proxy]';
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  if (!isObject(value)) {
	    return false;
	  }
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
	  var tag = baseGetTag(value);
	  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}
	
	module.exports = isFunction;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(33),
	    getRawTag = __webpack_require__(36),
	    objectToString = __webpack_require__(37);
	
	/** `Object#toString` result references. */
	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';
	
	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
	
	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  value = Object(value);
	  return (symToStringTag && symToStringTag in value)
	    ? getRawTag(value)
	    : objectToString(value);
	}
	
	module.exports = baseGetTag;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var root = __webpack_require__(34);
	
	/** Built-in value references. */
	var Symbol = root.Symbol;
	
	module.exports = Symbol;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var freeGlobal = __webpack_require__(35);
	
	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
	
	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();
	
	module.exports = root;


/***/ },
/* 35 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
	
	module.exports = freeGlobal;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(33);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;
	
	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
	
	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty.call(value, symToStringTag),
	      tag = value[symToStringTag];
	
	  try {
	    value[symToStringTag] = undefined;
	    var unmasked = true;
	  } catch (e) {}
	
	  var result = nativeObjectToString.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag] = tag;
	    } else {
	      delete value[symToStringTag];
	    }
	  }
	  return result;
	}
	
	module.exports = getRawTag;


/***/ },
/* 37 */
/***/ function(module, exports) {

	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;
	
	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString.call(value);
	}
	
	module.exports = objectToString;


/***/ },
/* 38 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}
	
	module.exports = isObject;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var coreJsData = __webpack_require__(40);
	
	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());
	
	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}
	
	module.exports = isMasked;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var root = __webpack_require__(34);
	
	/** Used to detect overreaching core-js shims. */
	var coreJsData = root['__core-js_shared__'];
	
	module.exports = coreJsData;


/***/ },
/* 41 */
/***/ function(module, exports) {

	/** Used for built-in method references. */
	var funcProto = Function.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	
	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to convert.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}
	
	module.exports = toSource;


/***/ },
/* 42 */
/***/ function(module, exports) {

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}
	
	module.exports = getValue;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var mapCacheClear = __webpack_require__(44),
	    mapCacheDelete = __webpack_require__(52),
	    mapCacheGet = __webpack_require__(55),
	    mapCacheHas = __webpack_require__(56),
	    mapCacheSet = __webpack_require__(57);
	
	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;
	
	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}
	
	// Add methods to `MapCache`.
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype['delete'] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;
	
	module.exports = MapCache;


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var Hash = __webpack_require__(45),
	    ListCache = __webpack_require__(15),
	    Map = __webpack_require__(28);
	
	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.size = 0;
	  this.__data__ = {
	    'hash': new Hash,
	    'map': new (Map || ListCache),
	    'string': new Hash
	  };
	}
	
	module.exports = mapCacheClear;


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var hashClear = __webpack_require__(46),
	    hashDelete = __webpack_require__(48),
	    hashGet = __webpack_require__(49),
	    hashHas = __webpack_require__(50),
	    hashSet = __webpack_require__(51);
	
	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;
	
	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}
	
	// Add methods to `Hash`.
	Hash.prototype.clear = hashClear;
	Hash.prototype['delete'] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;
	
	module.exports = Hash;


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(47);
	
	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = nativeCreate ? nativeCreate(null) : {};
	  this.size = 0;
	}
	
	module.exports = hashClear;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(29);
	
	/* Built-in method references that are verified to be native. */
	var nativeCreate = getNative(Object, 'create');
	
	module.exports = nativeCreate;


/***/ },
/* 48 */
/***/ function(module, exports) {

	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(key) {
	  var result = this.has(key) && delete this.__data__[key];
	  this.size -= result ? 1 : 0;
	  return result;
	}
	
	module.exports = hashDelete;


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(47);
	
	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
	  var data = this.__data__;
	  if (nativeCreate) {
	    var result = data[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty.call(data, key) ? data[key] : undefined;
	}
	
	module.exports = hashGet;


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(47);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
	  var data = this.__data__;
	  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
	}
	
	module.exports = hashHas;


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(47);
	
	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';
	
	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
	  var data = this.__data__;
	  this.size += this.has(key) ? 0 : 1;
	  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	  return this;
	}
	
	module.exports = hashSet;


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(53);
	
	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
	  var result = getMapData(this, key)['delete'](key);
	  this.size -= result ? 1 : 0;
	  return result;
	}
	
	module.exports = mapCacheDelete;


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var isKeyable = __webpack_require__(54);
	
	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
	  var data = map.__data__;
	  return isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}
	
	module.exports = getMapData;


/***/ },
/* 54 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}
	
	module.exports = isKeyable;


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(53);
	
	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
	  return getMapData(this, key).get(key);
	}
	
	module.exports = mapCacheGet;


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(53);
	
	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
	  return getMapData(this, key).has(key);
	}
	
	module.exports = mapCacheHas;


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(53);
	
	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
	  var data = getMapData(this, key),
	      size = data.size;
	
	  data.set(key, value);
	  this.size += data.size == size ? 0 : 1;
	  return this;
	}
	
	module.exports = mapCacheSet;


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var baseAssignValue = __webpack_require__(59),
	    eq = __webpack_require__(19);
	
	/**
	 * This function is like `assignValue` except that it doesn't assign
	 * `undefined` values.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignMergeValue(object, key, value) {
	  if ((value !== undefined && !eq(object[key], value)) ||
	      (value === undefined && !(key in object))) {
	    baseAssignValue(object, key, value);
	  }
	}
	
	module.exports = assignMergeValue;


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var defineProperty = __webpack_require__(60);
	
	/**
	 * The base implementation of `assignValue` and `assignMergeValue` without
	 * value checks.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function baseAssignValue(object, key, value) {
	  if (key == '__proto__' && defineProperty) {
	    defineProperty(object, key, {
	      'configurable': true,
	      'enumerable': true,
	      'value': value,
	      'writable': true
	    });
	  } else {
	    object[key] = value;
	  }
	}
	
	module.exports = baseAssignValue;


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(29);
	
	var defineProperty = (function() {
	  try {
	    var func = getNative(Object, 'defineProperty');
	    func({}, '', {});
	    return func;
	  } catch (e) {}
	}());
	
	module.exports = defineProperty;


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var createBaseFor = __webpack_require__(62);
	
	/**
	 * The base implementation of `baseForOwn` which iterates over `object`
	 * properties returned by `keysFunc` and invokes `iteratee` for each property.
	 * Iteratee functions may exit iteration early by explicitly returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();
	
	module.exports = baseFor;


/***/ },
/* 62 */
/***/ function(module, exports) {

	/**
	 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var index = -1,
	        iterable = Object(object),
	        props = keysFunc(object),
	        length = props.length;
	
	    while (length--) {
	      var key = props[fromRight ? length : ++index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}
	
	module.exports = createBaseFor;


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var assignMergeValue = __webpack_require__(58),
	    cloneBuffer = __webpack_require__(64),
	    cloneTypedArray = __webpack_require__(65),
	    copyArray = __webpack_require__(68),
	    initCloneObject = __webpack_require__(69),
	    isArguments = __webpack_require__(74),
	    isArray = __webpack_require__(77),
	    isArrayLikeObject = __webpack_require__(78),
	    isBuffer = __webpack_require__(81),
	    isFunction = __webpack_require__(31),
	    isObject = __webpack_require__(38),
	    isPlainObject = __webpack_require__(83),
	    isTypedArray = __webpack_require__(84),
	    toPlainObject = __webpack_require__(88);
	
	/**
	 * A specialized version of `baseMerge` for arrays and objects which performs
	 * deep merges and tracks traversed objects enabling objects with circular
	 * references to be merged.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {string} key The key of the value to merge.
	 * @param {number} srcIndex The index of `source`.
	 * @param {Function} mergeFunc The function to merge values.
	 * @param {Function} [customizer] The function to customize assigned values.
	 * @param {Object} [stack] Tracks traversed source values and their merged
	 *  counterparts.
	 */
	function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
	  var objValue = object[key],
	      srcValue = source[key],
	      stacked = stack.get(srcValue);
	
	  if (stacked) {
	    assignMergeValue(object, key, stacked);
	    return;
	  }
	  var newValue = customizer
	    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
	    : undefined;
	
	  var isCommon = newValue === undefined;
	
	  if (isCommon) {
	    var isArr = isArray(srcValue),
	        isBuff = !isArr && isBuffer(srcValue),
	        isTyped = !isArr && !isBuff && isTypedArray(srcValue);
	
	    newValue = srcValue;
	    if (isArr || isBuff || isTyped) {
	      if (isArray(objValue)) {
	        newValue = objValue;
	      }
	      else if (isArrayLikeObject(objValue)) {
	        newValue = copyArray(objValue);
	      }
	      else if (isBuff) {
	        isCommon = false;
	        newValue = cloneBuffer(srcValue, true);
	      }
	      else if (isTyped) {
	        isCommon = false;
	        newValue = cloneTypedArray(srcValue, true);
	      }
	      else {
	        newValue = [];
	      }
	    }
	    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
	      newValue = objValue;
	      if (isArguments(objValue)) {
	        newValue = toPlainObject(objValue);
	      }
	      else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
	        newValue = initCloneObject(srcValue);
	      }
	    }
	    else {
	      isCommon = false;
	    }
	  }
	  if (isCommon) {
	    // Recursively merge objects and arrays (susceptible to call stack limits).
	    stack.set(srcValue, newValue);
	    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
	    stack['delete'](srcValue);
	  }
	  assignMergeValue(object, key, newValue);
	}
	
	module.exports = baseMergeDeep;


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(34);
	
	/** Detect free variable `exports`. */
	var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
	
	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
	
	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;
	
	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : undefined,
	    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;
	
	/**
	 * Creates a clone of  `buffer`.
	 *
	 * @private
	 * @param {Buffer} buffer The buffer to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Buffer} Returns the cloned buffer.
	 */
	function cloneBuffer(buffer, isDeep) {
	  if (isDeep) {
	    return buffer.slice();
	  }
	  var length = buffer.length,
	      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
	
	  buffer.copy(result);
	  return result;
	}
	
	module.exports = cloneBuffer;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)(module)))

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var cloneArrayBuffer = __webpack_require__(66);
	
	/**
	 * Creates a clone of `typedArray`.
	 *
	 * @private
	 * @param {Object} typedArray The typed array to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned typed array.
	 */
	function cloneTypedArray(typedArray, isDeep) {
	  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
	  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
	}
	
	module.exports = cloneTypedArray;


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var Uint8Array = __webpack_require__(67);
	
	/**
	 * Creates a clone of `arrayBuffer`.
	 *
	 * @private
	 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
	 * @returns {ArrayBuffer} Returns the cloned array buffer.
	 */
	function cloneArrayBuffer(arrayBuffer) {
	  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
	  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
	  return result;
	}
	
	module.exports = cloneArrayBuffer;


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var root = __webpack_require__(34);
	
	/** Built-in value references. */
	var Uint8Array = root.Uint8Array;
	
	module.exports = Uint8Array;


/***/ },
/* 68 */
/***/ function(module, exports) {

	/**
	 * Copies the values of `source` to `array`.
	 *
	 * @private
	 * @param {Array} source The array to copy values from.
	 * @param {Array} [array=[]] The array to copy values to.
	 * @returns {Array} Returns `array`.
	 */
	function copyArray(source, array) {
	  var index = -1,
	      length = source.length;
	
	  array || (array = Array(length));
	  while (++index < length) {
	    array[index] = source[index];
	  }
	  return array;
	}
	
	module.exports = copyArray;


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var baseCreate = __webpack_require__(70),
	    getPrototype = __webpack_require__(71),
	    isPrototype = __webpack_require__(73);
	
	/**
	 * Initializes an object clone.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneObject(object) {
	  return (typeof object.constructor == 'function' && !isPrototype(object))
	    ? baseCreate(getPrototype(object))
	    : {};
	}
	
	module.exports = initCloneObject;


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(38);
	
	/** Built-in value references. */
	var objectCreate = Object.create;
	
	/**
	 * The base implementation of `_.create` without support for assigning
	 * properties to the created object.
	 *
	 * @private
	 * @param {Object} proto The object to inherit from.
	 * @returns {Object} Returns the new object.
	 */
	var baseCreate = (function() {
	  function object() {}
	  return function(proto) {
	    if (!isObject(proto)) {
	      return {};
	    }
	    if (objectCreate) {
	      return objectCreate(proto);
	    }
	    object.prototype = proto;
	    var result = new object;
	    object.prototype = undefined;
	    return result;
	  };
	}());
	
	module.exports = baseCreate;


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var overArg = __webpack_require__(72);
	
	/** Built-in value references. */
	var getPrototype = overArg(Object.getPrototypeOf, Object);
	
	module.exports = getPrototype;


/***/ },
/* 72 */
/***/ function(module, exports) {

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}
	
	module.exports = overArg;


/***/ },
/* 73 */
/***/ function(module, exports) {

	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;
	
	  return value === proto;
	}
	
	module.exports = isPrototype;


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsArguments = __webpack_require__(75),
	    isObjectLike = __webpack_require__(76);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;
	
	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
	  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
	    !propertyIsEnumerable.call(value, 'callee');
	};
	
	module.exports = isArguments;


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(32),
	    isObjectLike = __webpack_require__(76);
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';
	
	/**
	 * The base implementation of `_.isArguments`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 */
	function baseIsArguments(value) {
	  return isObjectLike(value) && baseGetTag(value) == argsTag;
	}
	
	module.exports = baseIsArguments;


/***/ },
/* 76 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}
	
	module.exports = isObjectLike;


/***/ },
/* 77 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;
	
	module.exports = isArray;


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(79),
	    isObjectLike = __webpack_require__(76);
	
	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	}
	
	module.exports = isArrayLikeObject;


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(31),
	    isLength = __webpack_require__(80);
	
	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(value.length) && !isFunction(value);
	}
	
	module.exports = isArrayLike;


/***/ },
/* 80 */
/***/ function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	module.exports = isLength;


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(34),
	    stubFalse = __webpack_require__(82);
	
	/** Detect free variable `exports`. */
	var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
	
	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
	
	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;
	
	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : undefined;
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
	
	/**
	 * Checks if `value` is a buffer.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	 * @example
	 *
	 * _.isBuffer(new Buffer(2));
	 * // => true
	 *
	 * _.isBuffer(new Uint8Array(2));
	 * // => false
	 */
	var isBuffer = nativeIsBuffer || stubFalse;
	
	module.exports = isBuffer;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)(module)))

/***/ },
/* 82 */
/***/ function(module, exports) {

	/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */
	function stubFalse() {
	  return false;
	}
	
	module.exports = stubFalse;


/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(32),
	    getPrototype = __webpack_require__(71),
	    isObjectLike = __webpack_require__(76);
	
	/** `Object#toString` result references. */
	var objectTag = '[object Object]';
	
	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);
	
	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
	    funcToString.call(Ctor) == objectCtorString;
	}
	
	module.exports = isPlainObject;


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsTypedArray = __webpack_require__(85),
	    baseUnary = __webpack_require__(86),
	    nodeUtil = __webpack_require__(87);
	
	/* Node.js helper references. */
	var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
	
	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
	
	module.exports = isTypedArray;


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(32),
	    isLength = __webpack_require__(80),
	    isObjectLike = __webpack_require__(76);
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';
	
	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';
	
	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
	typedArrayTags[errorTag] = typedArrayTags[funcTag] =
	typedArrayTags[mapTag] = typedArrayTags[numberTag] =
	typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
	typedArrayTags[setTag] = typedArrayTags[stringTag] =
	typedArrayTags[weakMapTag] = false;
	
	/**
	 * The base implementation of `_.isTypedArray` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 */
	function baseIsTypedArray(value) {
	  return isObjectLike(value) &&
	    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
	}
	
	module.exports = baseIsTypedArray;


/***/ },
/* 86 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.unary` without support for storing metadata.
	 *
	 * @private
	 * @param {Function} func The function to cap arguments for.
	 * @returns {Function} Returns the new capped function.
	 */
	function baseUnary(func) {
	  return function(value) {
	    return func(value);
	  };
	}
	
	module.exports = baseUnary;


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(35);
	
	/** Detect free variable `exports`. */
	var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
	
	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
	
	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;
	
	/** Detect free variable `process` from Node.js. */
	var freeProcess = moduleExports && freeGlobal.process;
	
	/** Used to access faster Node.js helpers. */
	var nodeUtil = (function() {
	  try {
	    return freeProcess && freeProcess.binding && freeProcess.binding('util');
	  } catch (e) {}
	}());
	
	module.exports = nodeUtil;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)(module)))

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	var copyObject = __webpack_require__(89),
	    keysIn = __webpack_require__(91);
	
	/**
	 * Converts `value` to a plain object flattening inherited enumerable string
	 * keyed properties of `value` to own properties of the plain object.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {Object} Returns the converted plain object.
	 * @example
	 *
	 * function Foo() {
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.assign({ 'a': 1 }, new Foo);
	 * // => { 'a': 1, 'b': 2 }
	 *
	 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
	 * // => { 'a': 1, 'b': 2, 'c': 3 }
	 */
	function toPlainObject(value) {
	  return copyObject(value, keysIn(value));
	}
	
	module.exports = toPlainObject;


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	var assignValue = __webpack_require__(90),
	    baseAssignValue = __webpack_require__(59);
	
	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */
	function copyObject(source, props, object, customizer) {
	  var isNew = !object;
	  object || (object = {});
	
	  var index = -1,
	      length = props.length;
	
	  while (++index < length) {
	    var key = props[index];
	
	    var newValue = customizer
	      ? customizer(object[key], source[key], key, object, source)
	      : undefined;
	
	    if (newValue === undefined) {
	      newValue = source[key];
	    }
	    if (isNew) {
	      baseAssignValue(object, key, newValue);
	    } else {
	      assignValue(object, key, newValue);
	    }
	  }
	  return object;
	}
	
	module.exports = copyObject;


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	var baseAssignValue = __webpack_require__(59),
	    eq = __webpack_require__(19);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue(object, key, value) {
	  var objValue = object[key];
	  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
	      (value === undefined && !(key in object))) {
	    baseAssignValue(object, key, value);
	  }
	}
	
	module.exports = assignValue;


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	var arrayLikeKeys = __webpack_require__(92),
	    baseKeysIn = __webpack_require__(95),
	    isArrayLike = __webpack_require__(79);
	
	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
	}
	
	module.exports = keysIn;


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	var baseTimes = __webpack_require__(93),
	    isArguments = __webpack_require__(74),
	    isArray = __webpack_require__(77),
	    isBuffer = __webpack_require__(81),
	    isIndex = __webpack_require__(94),
	    isTypedArray = __webpack_require__(84);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */
	function arrayLikeKeys(value, inherited) {
	  var isArr = isArray(value),
	      isArg = !isArr && isArguments(value),
	      isBuff = !isArr && !isArg && isBuffer(value),
	      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
	      skipIndexes = isArr || isArg || isBuff || isType,
	      result = skipIndexes ? baseTimes(value.length, String) : [],
	      length = result.length;
	
	  for (var key in value) {
	    if ((inherited || hasOwnProperty.call(value, key)) &&
	        !(skipIndexes && (
	           // Safari 9 has enumerable `arguments.length` in strict mode.
	           key == 'length' ||
	           // Node.js 0.10 has enumerable non-index properties on buffers.
	           (isBuff && (key == 'offset' || key == 'parent')) ||
	           // PhantomJS 2 has enumerable non-index properties on typed arrays.
	           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
	           // Skip index properties.
	           isIndex(key, length)
	        ))) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = arrayLikeKeys;


/***/ },
/* 93 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);
	
	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}
	
	module.exports = baseTimes;


/***/ },
/* 94 */
/***/ function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;
	
	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return !!length &&
	    (typeof value == 'number' || reIsUint.test(value)) &&
	    (value > -1 && value % 1 == 0 && value < length);
	}
	
	module.exports = isIndex;


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(38),
	    isPrototype = __webpack_require__(73),
	    nativeKeysIn = __webpack_require__(96);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeysIn(object) {
	  if (!isObject(object)) {
	    return nativeKeysIn(object);
	  }
	  var isProto = isPrototype(object),
	      result = [];
	
	  for (var key in object) {
	    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = baseKeysIn;


/***/ },
/* 96 */
/***/ function(module, exports) {

	/**
	 * This function is like
	 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * except that it includes inherited enumerable properties.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function nativeKeysIn(object) {
	  var result = [];
	  if (object != null) {
	    for (var key in Object(object)) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = nativeKeysIn;


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	var baseRest = __webpack_require__(98),
	    isIterateeCall = __webpack_require__(106);
	
	/**
	 * Creates a function like `_.assign`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return baseRest(function(object, sources) {
	    var index = -1,
	        length = sources.length,
	        customizer = length > 1 ? sources[length - 1] : undefined,
	        guard = length > 2 ? sources[2] : undefined;
	
	    customizer = (assigner.length > 3 && typeof customizer == 'function')
	      ? (length--, customizer)
	      : undefined;
	
	    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? undefined : customizer;
	      length = 1;
	    }
	    object = Object(object);
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, index, customizer);
	      }
	    }
	    return object;
	  });
	}
	
	module.exports = createAssigner;


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(99),
	    overRest = __webpack_require__(100),
	    setToString = __webpack_require__(102);
	
	/**
	 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 */
	function baseRest(func, start) {
	  return setToString(overRest(func, start, identity), func + '');
	}
	
	module.exports = baseRest;


/***/ },
/* 99 */
/***/ function(module, exports) {

	/**
	 * This method returns the first argument it receives.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 *
	 * console.log(_.identity(object) === object);
	 * // => true
	 */
	function identity(value) {
	  return value;
	}
	
	module.exports = identity;


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	var apply = __webpack_require__(101);
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;
	
	/**
	 * A specialized version of `baseRest` which transforms the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @param {Function} transform The rest array transform.
	 * @returns {Function} Returns the new function.
	 */
	function overRest(func, start, transform) {
	  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        array = Array(length);
	
	    while (++index < length) {
	      array[index] = args[start + index];
	    }
	    index = -1;
	    var otherArgs = Array(start + 1);
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = transform(array);
	    return apply(func, this, otherArgs);
	  };
	}
	
	module.exports = overRest;


/***/ },
/* 101 */
/***/ function(module, exports) {

	/**
	 * A faster alternative to `Function#apply`, this function invokes `func`
	 * with the `this` binding of `thisArg` and the arguments of `args`.
	 *
	 * @private
	 * @param {Function} func The function to invoke.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} args The arguments to invoke `func` with.
	 * @returns {*} Returns the result of `func`.
	 */
	function apply(func, thisArg, args) {
	  switch (args.length) {
	    case 0: return func.call(thisArg);
	    case 1: return func.call(thisArg, args[0]);
	    case 2: return func.call(thisArg, args[0], args[1]);
	    case 3: return func.call(thisArg, args[0], args[1], args[2]);
	  }
	  return func.apply(thisArg, args);
	}
	
	module.exports = apply;


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	var baseSetToString = __webpack_require__(103),
	    shortOut = __webpack_require__(105);
	
	/**
	 * Sets the `toString` method of `func` to return `string`.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var setToString = shortOut(baseSetToString);
	
	module.exports = setToString;


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	var constant = __webpack_require__(104),
	    defineProperty = __webpack_require__(60),
	    identity = __webpack_require__(99);
	
	/**
	 * The base implementation of `setToString` without support for hot loop shorting.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var baseSetToString = !defineProperty ? identity : function(func, string) {
	  return defineProperty(func, 'toString', {
	    'configurable': true,
	    'enumerable': false,
	    'value': constant(string),
	    'writable': true
	  });
	};
	
	module.exports = baseSetToString;


/***/ },
/* 104 */
/***/ function(module, exports) {

	/**
	 * Creates a function that returns `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {*} value The value to return from the new function.
	 * @returns {Function} Returns the new constant function.
	 * @example
	 *
	 * var objects = _.times(2, _.constant({ 'a': 1 }));
	 *
	 * console.log(objects);
	 * // => [{ 'a': 1 }, { 'a': 1 }]
	 *
	 * console.log(objects[0] === objects[1]);
	 * // => true
	 */
	function constant(value) {
	  return function() {
	    return value;
	  };
	}
	
	module.exports = constant;


/***/ },
/* 105 */
/***/ function(module, exports) {

	/** Used to detect hot functions by number of calls within a span of milliseconds. */
	var HOT_COUNT = 800,
	    HOT_SPAN = 16;
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeNow = Date.now;
	
	/**
	 * Creates a function that'll short out and invoke `identity` instead
	 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
	 * milliseconds.
	 *
	 * @private
	 * @param {Function} func The function to restrict.
	 * @returns {Function} Returns the new shortable function.
	 */
	function shortOut(func) {
	  var count = 0,
	      lastCalled = 0;
	
	  return function() {
	    var stamp = nativeNow(),
	        remaining = HOT_SPAN - (stamp - lastCalled);
	
	    lastCalled = stamp;
	    if (remaining > 0) {
	      if (++count >= HOT_COUNT) {
	        return arguments[0];
	      }
	    } else {
	      count = 0;
	    }
	    return func.apply(undefined, arguments);
	  };
	}
	
	module.exports = shortOut;


/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	var eq = __webpack_require__(19),
	    isArrayLike = __webpack_require__(79),
	    isIndex = __webpack_require__(94),
	    isObject = __webpack_require__(38);
	
	/**
	 * Checks if the given arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
	 *  else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	        ? (isArrayLike(object) && isIndex(index, object.length))
	        : (type == 'string' && index in object)
	      ) {
	    return eq(object[index], value);
	  }
	  return false;
	}
	
	module.exports = isIterateeCall;


/***/ },
/* 107 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var CLASSIC = exports.CLASSIC = {
	  1: {
	    time: 0,
	    minions: 15,
	    stats: {
	      speed: 0.75,
	      health: 50,
	      reward: 10
	    }
	  },
	  2: {
	    time: 15000,
	    minions: 20,
	    stats: {
	      speed: 0.75,
	      health: 125,
	      reward: 10
	    }
	  },
	  3: {
	    time: 15000,
	    minions: 25,
	    stats: {
	      speed: 0.75,
	      health: 125,
	      reward: 10
	    }
	  },
	  4: {
	    time: 15000,
	    minions: 25,
	    stats: {
	      speed: 0.75,
	      health: 150,
	      reward: 15
	    }
	  },
	  5: {
	    time: 15000,
	    minions: 30,
	    stats: {
	      speed: 0.75,
	      health: 300,
	      reward: 10
	    }
	  },
	  6: {
	    time: 15000,
	    minions: 30,
	    stats: {
	      speed: 0.75,
	      health: 500,
	      reward: 15
	    }
	  },
	  7: {
	    time: 15000,
	    minions: 30,
	    stats: {
	      speed: 0.75,
	      health: 600,
	      reward: 15
	    }
	  },
	  8: {
	    time: 15000,
	    minions: 30,
	    stats: {
	      speed: 0.75,
	      health: 1000,
	      reward: 15
	    }
	  }
	};

/***/ },
/* 108 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var BASE_TOWER = exports.BASE_TOWER = {
	  turretSprite: './assets/basicturret.png',
	  bulletSprite: './assets/bullet.png',
	  levels: {
	    1: {
	      rateOfFire: 1500,
	      radius: 50,
	      damage: 5,
	      numTargets: 1,
	      cost: 5,
	      animation: "level-1"
	    },
	    2: {
	      rateOfFire: 1500,
	      radius: 75,
	      damage: 15,
	      numTargets: 1,
	      cost: 15,
	      animation: "level-2"
	    },
	    3: {
	      rateOfFire: 1500,
	      radius: 100,
	      damage: 50,
	      numTargets: 1,
	      cost: 50,
	      animation: "level-3"
	    },
	    4: {
	      rateOfFire: 1500,
	      radius: 200,
	      damage: 200,
	      numTargets: 1,
	      cost: 100,
	      animation: "level-4"
	    }
	  }
	};
	
	var FAST_TOWER = exports.FAST_TOWER = {
	  turretSprite: './assets/turret.png',
	  bulletSprite: './assets/plasma2.png',
	  levels: {
	    1: {
	      rateOfFire: 500,
	      radius: 75,
	      damage: 10,
	      numTargets: 1,
	      cost: 15,
	      animation: "level-1"
	    },
	    2: {
	      rateOfFire: 500,
	      radius: 90,
	      damage: 20,
	      numTargets: 1,
	      cost: 30,
	      animation: "level-2"
	    },
	    3: {
	      rateOfFire: 500,
	      radius: 100,
	      damage: 50,
	      numTargets: 1,
	      cost: 60,
	      animation: "level-3"
	    },
	    4: {
	      rateOfFire: 500,
	      radius: 110,
	      damage: 100,
	      numTargets: 1,
	      cost: 150,
	      animation: "level-4"
	    }
	  }
	};
	
	var GROUND_TOWER = exports.GROUND_TOWER = {
	  turretSprite: './assets/groundattackturret.png',
	  levels: {
	    1: {
	      rateOfFire: 2000,
	      radius: 50,
	      damage: 50,
	      numTargets: 0,
	      cost: 100,
	      animation: "level-1"
	    },
	    2: {
	      rateOfFire: 2000,
	      radius: 50,
	      damage: 100,
	      numTargets: 0,
	      cost: 200,
	      animation: "level-2"
	    },
	    3: {
	      rateOfFire: 1500,
	      radius: 50,
	      damage: 200,
	      numTargets: 0,
	      cost: 300,
	      animation: "level-3"
	    },
	    4: {
	      rateOfFire: 1500,
	      radius: 50,
	      damage: 400,
	      numTargets: 0,
	      cost: 400,
	      animation: "level-4"
	    }
	  }
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map