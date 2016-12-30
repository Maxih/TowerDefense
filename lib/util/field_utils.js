export function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

export function toRadians (angle) {
  return angle * (Math.PI / 180);
}

export function cursorToFieldPos(x, y) {
  x -= 8;
  y -= 8;

  let newX = Math.floor((x + 15) / 15) * 15;
  let newY = Math.floor((y + 15) / 15) * 15;

  newX = newX < 45 ? 45 : newX;
  newY = newY < 45 ? 45 : newY;

  newX = newX > (450 - 15) ? (450 - 15) : newX;
  newY = newY > (450 - 15) ? (450 - 15) : newY;

  return {x: newX, y: newY};
}
