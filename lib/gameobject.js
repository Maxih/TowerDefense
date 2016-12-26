const defaults = {

};

export default class GameObject {
  constructor(options) {
    this.elements = this.generateSprite();
    this.options = merge(defaults, options);
  }

  generateSprite() {

  }

  // begin death animation
  beginRemove() {

  }


  //remove object
  endRemove() {

  }

  getCenterCoord() {
    return {
      x: this.elements.x
    }
  }
}
