import * as Util from "./util/field_utils";
import merge from "lodash/merge";

const defaults = {
  width: 30,
  height: 30
};

export default class GameObject {
  constructor(options = {}) {
    this.options = merge({}, defaults, options);

    this.elements = this.generateSprite();
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
      x: this.elements.x + (this.options.width / 2),
      y: this.elements.y + (this.options.height / 2)
    }
  }

  getAngleTo(object) {
    if(object === undefined)
      return 90;


    const thisCenter = {
      x: this.elements.x,
      y: this.elements.y
    };

    let x = object.x - thisCenter.x;
    let y = object.y - thisCenter.y;

    let angle = Util.toDegrees( Math.atan( y / x ) );


    if( thisCenter.x > object.x )
      angle = angle + 180;

    return angle;
  }

  getVectorOf(angle) {
    let rads = Util.toRadians(angle);

    return {
      x: Math.cos(rads),
      y: Math.sin(rads)
    }
  }

  fieldToGrid() {
    let x = this.elements.x / this.options.width;
    let y = this.elements.y / this.options.height;

    return {
      x: Math.floor(x),
      y: Math.floor(y)
    }
  }

  intersects(object) {
    return (this.elements.x < (object.elements.x + object.options.width) &&
          object.elements.x < (this.elements.x + this.options.width) &&
          this.elements.y < (object.elements.y + object.options.height) &&
          object.elements.y < (this.elements.y + this.options.height))
  }
}
