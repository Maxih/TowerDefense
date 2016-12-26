import Board from "./board";


$(() => {
  let stage = new createjs.Stage("tower-defense");

  const board = new Board(stage);
});
