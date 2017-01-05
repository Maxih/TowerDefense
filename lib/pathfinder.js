export default class PathFinder {
  constructor(grid) {
    this.grid = grid || this.createGrid();
    this.frontier = [];
    this.cameFrom = {};
    this.updated = false;
  }

  markWall(x, y) {
    this.grid[y][x].markWall();

  }

  dupBoard() {
    let board = []
    for(let i = 0; i < 32; i++) {
      board[i] = []
      for(let j = 0; j < 32; j++) {

        board[i][j] = new PathNode(j, i);
        board[i][j].wall = this.grid[i][j].wall;
      }
    }

    return new PathFinder(board);
  }

  printBoard() {
    for(let i = 0; i < 32; i++) {
      let row = this.grid[i].map((a) => {
        if(a.wall)
          return "X";
        else
          return "-";
      });

      console.log(i, row.join(""));
    }
  }

  update(x, y) {
    this.markWall(x - 1, y - 1);
    this.markWall(x, y - 1);
    this.markWall(x - 1, y);
    this.markWall(x, y);
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
    return board;
  }

  findPath(endX, endY) {
    let startEl = this.grid[endY][endX];
    this.cameFrom = {};
    this.frontier.push(startEl);
    this.cameFrom[startEl.toString()] = null;

    while(this.frontier.length > 0) {
      let curEl = this.frontier.shift(1);
      let next = this.neighbors(curEl);

      next.forEach((el) => {
        this.cameFrom[el.toString()] = curEl;
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

    let endCoord = this.grid[startY][startX];
    let curCoord = this.cameFrom[endCoord.toString()];

    let startCoord = curCoord;
    let lastOpenCoord = curCoord;


    while(curCoord !== null) {
      if(curCoord === undefined)
        return false;

      let isOpen = this.isHypotOpen(startCoord, curCoord);
      if(!isOpen){
        return lastOpenCoord;
      }
      else {
        if(curCoord !== null)
          lastOpenCoord = curCoord;
      }
      curCoord = this.cameFrom[curCoord.toString()];
    }
    return lastOpenCoord;
  }


  isHypotOpen(startCoord, endCoord) {
    // straight line
    if(startCoord.x === endCoord.x || startCoord.y === endCoord.y)
      return true;

    let x = endCoord.x - startCoord.x;
    let y = endCoord.y - startCoord.y;

    let m = y / x;

    for(let i = 0; i < Math.abs(y); i++) {

      let j = (y < 0) ? (0 - i) : i;
      let l = (y < 0) ? (0 - i - 1) : i + 1;
      let k = j === 0 ? 0 : Math.floor(m / j);
      let n = l === 0 ? 0 : Math.floor(m / l);


      let endX = startCoord.x + k;
      let endY = startCoord.y + j;

      let endX2= startCoord.x + n;
      let endY2 = startCoord.y + l;

      if(endX >= 0 && endX < 32 && endY >= 0 && endY < 32 &&
        endX2 >= 0 && endX2 < 32 && endY2 >= 0 && endY2 < 32) {
        if(this.grid[endY][endX].wall || this.grid[endY][endX2].wall ||
          this.grid[endY2][endX].wall || this.grid[endY2][endX2].wall) {
          return false;
        }
      } else {
        return false;
      }
    }

    return true;
  }


  neighbors(el) {
    let deltas = [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}];
    let elements = [];

    deltas.forEach((delta) => {
      let newX = delta.x + el.x;
      let newY = delta.y + el.y;


      if(newX >= 0 && newX < 32 && newY >= 0 && newY < 32) {
        let curEl = this.grid[newY][newX];

        if(!curEl.wall && this.cameFrom[curEl.toString()] === undefined) {
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
