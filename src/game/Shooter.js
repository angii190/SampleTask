import * as PIXI from 'pixi.js';
import { Rocket } from './Rocket.js';

export class Player extends PIXI.Sprite {
  constructor(x, y, texture) {
    super()
    this.target = null
    this.sprite = new PIXI.Sprite(texture)
    this.sprite.anchor.set(0.5)
    this.sprite.x = x
    this.sprite.y = y
    this.speed = 5
    this.rockets = []
    this.addChild(this.sprite)
  }

  angleTo(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1)
  }

  update(mousePosition) {
    if (!this.sprite || !mousePosition) return

    if (this.target) {
      const dxTarget = this.target.x - this.sprite.x
      const dyTarget = this.target.y - this.sprite.y
      const angleToTarget = Math.atan2(dyTarget, dxTarget)
      this.sprite.rotation = angleToTarget + Math.PI / 2
      const distance = Math.sqrt(dxTarget * dxTarget + dyTarget * dyTarget)

      if (distance < this.speed) {
        this.sprite.x = this.target.x
        this.sprite.y = this.target.y
        this.target = null
      } else {
        this.sprite.x += Math.cos(angleToTarget) * this.speed
        this.sprite.y += Math.sin(angleToTarget) * this.speed
      }
    } else {
      // If not moving, just rotate to face the mouse
      const dxCursor = mousePosition.x - this.sprite.x
      const dyCursor = mousePosition.y - this.sprite.y
      const angleToCursor = Math.atan2(dyCursor, dxCursor)
      this.sprite.rotation = angleToCursor + Math.PI / 2
    }

  }
  
  shoot(rocketTexture) {
    const angle = this.sprite.rotation - Math.PI / 2

    // Convert local position to global
    const global = this.sprite.getGlobalPosition()
    const x = global.x
    const y = global.y
    const rocket = new Rocket(x, y, angle, false, rocketTexture)
    this.parent.addChild(rocket)
    return rocket
  }

  moveTo(target) {
    this.target = { x: target.x, y: target.y }
  }
}

