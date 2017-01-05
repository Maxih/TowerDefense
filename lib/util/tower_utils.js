export const BASE_TOWER = {
  turretSprite: './assets/basicturret.png',
  bulletSprite: './assets/bullet.png',
  explosionSprite: './assets/bulletexplosion.png',
  levels: {
    1: {
      rateOfFire: 1500,
      radius: 50,
      damage: 25,
      numTargets: 1,
      cost: 5,
      animation: "level-1"
    },
    2: {
      rateOfFire: 1500,
      radius: 75,
      damage: 75,
      numTargets: 1,
      cost: 15,
      animation: "level-2"
    },
    3: {
      rateOfFire: 1000,
      radius: 100,
      damage: 150,
      numTargets: 1,
      cost: 50,
      animation: "level-3"
    },
    4: {
      rateOfFire: 1000,
      radius: 200,
      damage: 250,
      numTargets: 2,
      cost: 100,
      animation: "level-4"
    }
  }
}

export const FAST_TOWER = {
  turretSprite: './assets/turret.png',
  bulletSprite: './assets/plasma2.png',
  explosionSprite: './assets/plasmaexplosion.png',
  levels: {
    1: {
      rateOfFire: 500,
      radius: 75,
      damage: 15,
      numTargets: 1,
      cost: 15,
      animation: "level-1"
    },
    2: {
      rateOfFire: 500,
      radius: 90,
      damage: 50,
      numTargets: 1,
      cost: 30,
      animation: "level-2"
    },
    3: {
      rateOfFire: 500,
      radius: 100,
      damage: 100,
      numTargets: 1,
      cost: 60,
      animation: "level-3"
    },
    4: {
      rateOfFire: 500,
      radius: 110,
      damage: 300,
      numTargets: 1,
      cost: 200,
      animation: "level-4"
    }
  }
}

export const GROUND_TOWER = {
  turretSprite: './assets/groundattackturret.png',
  explosionSprite: './assets/groundattack.png',
  levels: {
    1: {
      rateOfFire: 2000,
      radius: 50,
      damage: 100,
      numTargets: 0,
      cost: 200,
      slowMult: 1,
      slowLength: 0,
      slowChance: 0,
      animation: "level-1"
    },
    2: {
      rateOfFire: 2000,
      radius: 50,
      damage: 200,
      numTargets: 0,
      cost: 200,
      slowMult: 1,
      slowLength: 0,
      slowChance: 0,
      animation: "level-2"
    },
    3: {
      rateOfFire: 1500,
      radius: 50,
      damage: 300,
      numTargets: 0,
      cost: 300,
      slowMult: 1,
      slowLength: 0,
      slowChance: 0,
      animation: "level-3"
    },
    4: {
      rateOfFire: 1500,
      radius: 50,
      damage: 500,
      numTargets: 0,
      cost: 400,
      slowMult: 1,
      slowLength: 0,
      slowChance: 0,
      animation: "level-4"
    }
  }
}

export const FREEZE_TOWER = {
  turretSprite: './assets/freezetower.png',
  explosionSprite: './assets/freezeattack.png',
  levels: {
    1: {
      rateOfFire: 2000,
      radius: 50,
      damage: 10,
      numTargets: 0,
      cost: 50,
      slowMult: .2,
      slowLength: 1000,
      slowChance: .3,
      animation: "level-1"
    },
    2: {
      rateOfFire: 2000,
      radius: 50,
      damage: 10,
      numTargets: 0,
      cost: 75,
      slowMult: .1,
      slowLength: 1500,
      slowChance: .4,
      animation: "level-2"
    },
    3: {
      rateOfFire: 2000,
      radius: 50,
      damage: 10,
      numTargets: 0,
      cost: 150,
      slowMult: .05,
      slowLength: 2000,
      slowChance: .5,
      animation: "level-3"
    },
    4: {
      rateOfFire: 2000,
      radius: 50,
      damage: 10,
      numTargets: 0,
      cost: 200,
      slowMult: 0,
      slowLength: 2500,
      slowChance: .6,
      animation: "level-4"
    },
  }
}
