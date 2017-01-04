export const BASE_TOWER = {
  turretSprite: './assets/basicturret.png',
  bulletSprite: './assets/bullet.png',
  explosionSprite: './assets/bulletexplosion.png',
  levels: {
    1: {
      rateOfFire: 1500,
      radius: 50,
      damage: 5,
      numTargets: 1,
      cost: 5,
      animation: "level-1"
    },
    2: {
      rateOfFire: 1500,
      radius: 75,
      damage: 15,
      numTargets: 1,
      cost: 15,
      animation: "level-2"
    },
    3: {
      rateOfFire: 1500,
      radius: 100,
      damage: 50,
      numTargets: 1,
      cost: 50,
      animation: "level-3"
    },
    4: {
      rateOfFire: 1500,
      radius: 200,
      damage: 200,
      numTargets: 1,
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
      damage: 10,
      numTargets: 1,
      cost: 15,
      animation: "level-1"
    },
    2: {
      rateOfFire: 500,
      radius: 90,
      damage: 20,
      numTargets: 1,
      cost: 30,
      animation: "level-2"
    },
    3: {
      rateOfFire: 500,
      radius: 100,
      damage: 50,
      numTargets: 1,
      cost: 60,
      animation: "level-3"
    },
    4: {
      rateOfFire: 500,
      radius: 110,
      damage: 100,
      numTargets: 1,
      cost: 150,
      animation: "level-4"
    }
  }
}

export const GROUND_TOWER = {
  turretSprite: './assets/groundattackturret.png',
  levels: {
    1: {
      rateOfFire: 2000,
      radius: 50,
      damage: 50,
      numTargets: 0,
      cost: 100,
      animation: "level-1"
    },
    2: {
      rateOfFire: 2000,
      radius: 50,
      damage: 100,
      numTargets: 0,
      cost: 200,
      animation: "level-2"
    },
    3: {
      rateOfFire: 1500,
      radius: 50,
      damage: 200,
      numTargets: 0,
      cost: 300,
      animation: "level-3"
    },
    4: {
      rateOfFire: 1500,
      radius: 50,
      damage: 400,
      numTargets: 0,
      cost: 400,
      animation: "level-4"
    }
  }
}
