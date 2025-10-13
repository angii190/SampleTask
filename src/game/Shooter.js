import * as PIXI from 'pixi.js'
export class Shooter extends PIXI.Sprite {
  constructor() {
    super()
    this.addSprite()
    console.log("Shooter created");
  }
  // This method creates and adds the shooter sprite to the game
  async addSprite() {
    const x = 100
    const y = 100
    const texture = await PIXI.Assets.load('src/assets/images/shooter.png')
    this.spaceShooter = new PIXI.Sprite(texture)
    this.spaceShooter.position.set(x, y)

    this.speed = 5;
    this.spaceShooter.anchor.set(0.5)
    this.addChild(this.spaceShooter)
  }

  // This method moves the shooter towards a target position
  moveTo(targetX, targetY) {
    const dx = targetX - this.spaceShooter.x
    const dy = targetY - this.spaceShooter.y
    const angle = Math.atan2(dy, dx);
    this.spaceShooter.x += Math.cos(angle) * this.speed
    this.spaceShooter.y += Math.sin(angle) * this.speed
  }

  // This method rotates the shooter to face a target position
  rotateTo(targetX, targetY) {
    const dx = targetX - this.spaceShooter.x
    const dy = targetY - this.spaceShooter.y
    this.spaceShooter.rotation = Math.atan2(dy, dx)
  }
  // Getter to access the shooter's sprite
  get view() {
    return this.spaceShooter;
  }

}