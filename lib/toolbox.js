import { merge } from "lodash";

const defaultHandles = {
  update: null,
  newTower: null,
}

export default class ToolBox {
  constructor(handles = defaultHandles) {
    this.elements = new createjs.Container();

    this.handles = merge(defaultHandles, handles);

    this.generateToolBar();
  }

  generateToolBar() {
    let toolBar = new createjs.Shape();
    toolBar.graphics.beginFill("Black").drawRect(0, 0, 420, 60).endFill();
    this.elements.addChild(toolBar);
    this.handles.update();

    this.generateToolItems();
  }

  generateToolItems() {
    this.newTowerButton();

    this.handles.update();
  }

  newTowerButton() {
    let addTowerButton = new createjs.Shape();
    addTowerButton.graphics.beginFill("Purple").drawRect(15, 15, 30, 30).endFill();
    addTowerButton.on("click", this.handles.newTower);
    this.elements.addChild(addTowerButton);
  }
}
