import * as PIXI from 'pixi.js'
export class Rocket extends PIXI.Container {
    constructor(x, y, angle, fromEnemy, rocketTexture) {
        super()
        this.x = x
        this.y = y
        this.speed = 3
        this.fromEnemy = fromEnemy

        this.sprite = new PIXI.Sprite(rocketTexture)
        this.sprite.anchor.set(0.5)
        this.sprite.scale.set(0.6)
        this.sprite.rotation = angle + Math.PI / 2

        this.velocityX = Math.cos(angle) * this.speed
        this.velocityY = Math.sin(angle) * this.speed

        this.addChild(this.sprite)

    }

    update() {
        if (this.sprite) {
            this.x += this.velocityX
            this.y += this.velocityY
        }
    }

    checkCollision(target) {
        if (!this.sprite || !target) {
            console.warn("Collision check skipped: missing sprite or target")
            return false
        }
        const targetPos = target.sprite.getGlobalPosition()
        const rocketPos = this.getGlobalPosition()

        const dx = rocketPos.x - targetPos.x
        const dy = rocketPos.y - targetPos.y
        const result = Math.sqrt(dx * dx + dy * dy)
        return result < 30
    }
}
