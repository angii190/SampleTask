import * as PIXI from 'pixi.js'
import { Rocket } from './Rocket.js'
export class Enemy extends PIXI.Container {
    constructor(x, y, texture) {
        super()
        this.isAlive = true
        this.createSprite(x, y, texture)

    }

    createSprite(x, y, texture) {
        this.sprite = new PIXI.Sprite(texture)
        this.sprite.anchor.set(0.5)
        this.x = x
        this.y = y
        this.lastShot = 0
        this.speed = 1
        this.addChild(this.sprite)
    }

    angleTo(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1)
    }

    checkCollision(target) {
        if (!this.sprite || !target?.sprite) return false

        const dx = this.x - target.sprite.x
        const dy = this.y - target.sprite.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        return distance < (this.sprite.width + target.sprite.width) / 2
    }


    update(player) {
        if (!this.isAlive || !player || !this.sprite) {
            console.warn("Enemy update skipped: missing player or sprite")
            return
        }
        const angle = this.angleTo(this.x, this.y, player.sprite.x, player.sprite.y)
        this.sprite.rotation = angle;
        this.x += Math.cos(angle) * this.speed
        this.y += Math.sin(angle) * this.speed

    }

    canShoot() {
    return this.isAlive && Date.now() - this.lastShot > 2000 && this.y > 0
}


    shoot(rockets, player, rocketTexture) {
        this.lastShot = Date.now()

        const angle = this.angleTo(this.x, this.y, player.sprite.x, player.sprite.y)
        const rocket = new Rocket(this.x, this.y, angle, true, rocketTexture)
        rockets.push(rocket)
        globalThis.__PIXI_APP__.stage.addChild(rocket)
    }
}
