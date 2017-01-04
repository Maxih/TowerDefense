import Board from "./board";


$(() => {
  let stage = new createjs.Stage("tower-defense");

  const game = new TowerDefense(stage);

  $(".reset-button").click((e) => {
    game.newBoard();
  });
});

class TowerDefense {
  constructor(stage) {
    this.num = 0;

    this.stage = stage;
    this.board = null;

    this.newBoard();

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", this.updateBoard.bind(this));

    stage.on("stagemousemove", this.mouseMove.bind(this));
    this.stage.enableMouseOver(20);

  }

  mouseMove(e) {
    if(!this.board)
      return;

    this.board.mouseMove(e);
  }

  updateBoard() {
    if(!this.board)
      return;

    this.board.updateField();
  }

  newBoard() {
    this.stage.removeAllChildren();
    delete this.board;
    this.board = null;
    this.board = new Board(this.stage, this.num);
    this.board.onLose = this.displayLose.bind(this);
    this.board.onWin = this.displayWin.bind(this);

    this.num++;
  }

  displayLose() {
    this.displayMessage("You Lose.");
  }

  displayWin() {
    this.displayMessage("You Win!!!");
  }

  displayMessage(message) {
    this.stage.removeAllChildren();

    const messageText = new createjs.Text(message, "50px Pixel", "#F1F1F1");

    messageText.x = 100;
    messageText.y = 200;

    this.stage.addChild(messageText);
  }
}
