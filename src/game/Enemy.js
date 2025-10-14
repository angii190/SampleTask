import * as PIXI from 'pixi.js'
import { Bullet } from './Bullet.js';
export class Enemy extends PIXI.Sprite {
    constructor(player){
        super()
    }

    async createEnemy(){
        const texture = await PIXI.Assets.load('src/assets/images/shooter.png')
        this.enemy = new PIXI.Sprite(texture)
        this.enemy.anchor.set(0.5)
        this.enemy.x = Math.random() * 800
        this.enemy.y = Math.random() * 600
        this.speed = 2
        this.rockets = []
        this.shootingInterval = setInterval(() => this.shoot(), 2000)
    }

    moveEnemy(){
        const directionX = this.player.x - this.enemy.x
        const directionY = this.player.y - this.enemy.y
        const angle = Math.atan2(directionY, directionX)
        this.enemy.x += Math.cos(angle) * this.speed
        this.enemy.y += Math.sin(angle) * this.speed
    }

    shoot(){
        const rocket = new Bullet(this.enemy.x, this.enemy.y, this.player.x, this.player.y)
        this.rockets.push(rocket)
        this.parent.addChild(rocket)
    }

    destroy() {
    clearInterval(this.shootInterval);
    this.sprite.destroy();
    this.rockets.forEach((r) => r.destroy());
  }

}
