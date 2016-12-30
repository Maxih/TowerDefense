export default class PathFinder {
  constructor() {
    this.grid = this.createGrid();
    this.frontier = [];
    this.came_from = {};

  }

  markWall(x, y) {
    this.grid[y][x].markWall();
    // for(let i = 0; i < 32; i++) {
    //   let row = this.grid[i].map((a) => {
    //     if(a.wall)
    //       return "X";
    //     else
    //       return "-";
    //   });
    //
    //   console.log(i, row.join(""));
    // }
  }

  createGrid() {
    let board = []
    for(let i = 0; i < 32; i++) {
      board[i] = []
      for(let j = 0; j < 32; j++) {

        board[i][j] = new PathNode(j, i);
        if((i === 0 || i === 31 || j === 0 || j === 31 || i === 1 || i === 30 || j === 1 || j === 30 ) && (j > 19 || j < 12)) {
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

  findPath(endX, endY) {
    let startEl = this.grid[endY][endX];
    this.came_from = {};
    this.frontier.push(startEl);
    this.came_from[startEl.toString()] = null;

    while(this.frontier.length > 0) {
      let curEl = this.frontier.shift(1);
      let next = this.neighbors(curEl);

      next.forEach((el) => {
        this.came_from[el.toString()] = curEl;
        this.frontier.push(el);
      });
    }


  }

  getPathToCoord(startX, startY, endX, endY) {
    if(!(startX >= 0 && startX < 32 &&
      startY >= 0 && startY < 32 &&
      endX >= 0 && endX < 32 &&
      endY >= 0 && endY < 32))
      return { x: endX, y: endY };

    // this.findPath(startX, startY, endX, endY);


    let startCoord = this.grid[endY][endX];
    let endCoord = this.grid[startY][startX];
    let curCoord = this.came_from[endCoord.toString()];
    let path = [];
    let path1 = {}

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

  neighbors(el) {
    let deltas = [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}];
    let elements = [];

    deltas.forEach((delta) => {
      let newX = delta.x + el.x;
      let newY = delta.y + el.y;


      if(newX >= 0 && newX < 32 && newY >= 0 && newY < 32) {
        let curEl = this.grid[newY][newX];

        if(!curEl.wall && this.came_from[curEl.toString()] === undefined) {
          elements.push(curEl);
        }
      }
    });
    return elements;
  }
}

class PathNode {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.wall = false;
  }

  markWall() {
    this.wall = true;
  }

  toString() {
    return `${this.x}-${this.y}`;
  }
}
