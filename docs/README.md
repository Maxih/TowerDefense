# TowerDefense

### Playing field and tower placement

The field is split between a virtual field and a visual one. The virtual board
is a two dimensional array used for efficiently pathfinding as well as keeping
the towers aligned to a grid.

The visual field is a canvas element which converts mouse position to virtual
grid position, allowing the virtual board to keep track of obstructions and
ensure that there is always at least one path to the end.

### GameObject class

The `GameObject` class is a wrapper class for all reactive elements on the board.
It houses methods for calculating the angle between two objects as well as the
corresponding vector, as well as other useful utilities.

### Minions and path finding

Minions are an extension of the `GameObject` class. They contain a reference to
the virtual board and when calculating their next position, they convert their
visual board position to the corresponding position on the virtual board and then
find their next coordinate based on the pathfinding algorithm.

The pathfinding algorithm uses breadth-first-search to create a `HashMap` of
`cameFrom` coordinates. This allows each minion to do a simple lookup into the
`cameFrom` coordinates map when deciding where to move, instead of individually
calculating a path for themselves. The BFS search works backwards, thinking of
the end point as the start point and filling the `cameFrom` hash map with values
that would guide the minion to the end from any open coordinate on the board.

Minions are intelligent when picking their route. When finding the next coordinate
from the `cameFrom` map, a minion will check the coordinates underneath the
hypotenuse of its current position and its potential future position, in order
to skip coordinates and proceed directly to the furthest point that is not obstructed.

### Projectiles

Projectiles are an extension of the `GameObject` class. They contain an initial
position as well as a target, continuously updating their angle and vector to adjust
themselves to the targets position. Due to projectiles containing a reference to their
target, any change to the target position will be reflected in the projectiles
angle and vector, making them guided and ensuring that they hit their target.

### Upgrading

Towers are highly dynamic, taking an options hash in the constructor and applying
the options to their method of attack. The angle of their turret is dictated by
the first target in their target hash.

### Blocking

When a new tower is being placed, a duplicate of the virtual board is created.
A tower is placed in the specified coordinate and a new path from the start coordinate
to the end coordinate is generated. If the path terminates before the end is reached,
the path is considered block and the move is prevented. Otherwise the old board is
overwritten with the new board and the tower is placed successfully.
