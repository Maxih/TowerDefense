# TowerDefense

### Background

Tower defense is a 2d builder game where pieces are put onto a board forming a pathway for AI controlled minions to navigate. Each minion that successfully navigates the pathway without being destroyed costs the player a life. The game is lost when the player runs out of lives.

Each piece placed by the player has a unique talent, ranging from slow shooting to fast shooting to area of effect. Each tower does a definite amount of damage to the minions.

### Functionality & MVP  

With this Tower Defense game, users will be able to:

- [ ] Start, pause, and reset the game
- [ ] Spend money on tiles to place on the board
- [ ] Place tiles on the board, always leaving one route open
- [ ] Sell tiles for a fraction of the cost

### Wireframes

This app will consist of a single screen with game board, game controls, and nav links to the Github, my LinkedIn,

### Architecture and Technologies

This project will be implemented with the following technologies:

- Vanilla JavaScript and `jQuery` for overall structure and game logic,
- `Easel.js` with `HTML5 Canvas` for DOM manipulation and rendering,
- Webpack to bundle and serve up the various scripts.

In addition to the webpack entry file, there will be three scripts involved in this project:

`board.js`: this script will handle the logic for creating and updating the necessary `Easel.js` elements and rendering them to the DOM.

`minion.js` this script will hold the base class for minions, with their movement logic and base settings, to be extended with the addition of more types.

`tower.js` this script will hold the base class for towers, with the attack logic and base settings to be extended with the addition of more types.

Additional script files may be generated as time permits to create new minions and towers.


### Implementation Timeline

**Day 1**: Setup all necessary Node modules, including getting webpack up and running and `Easel.js` installed.  Create `webpack.config.js` as well as `package.json`.  Write a basic entry file and the bare bones of all 3 scripts outlined above.  Learn the basics of `Easel.js`.  Goals for the day:

- Get a green bundle with `webpack`
- Learn enough `Easel.js` to render an object to the `Canvas` element

**Day 2**: Implement tiles being able to be placed as well as tile attacks

**Day 3**: Create the logic behind the minions traversal of the board, ensuring that there is always an available path.

**Day 4**: Install the controls for the user to interact with the game.  Style the frontend, making it polished and professional.  Goals for the day:

- Create controls for game speed, stop, start, reset, and shape type
- Have a styled `Canvas`, nice looking controls and title
- If time: include buttons on the side to toggle the color scheme of the cells
