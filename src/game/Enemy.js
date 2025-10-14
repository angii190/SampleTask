import * as PIXI from 'pixi.js'
import { Bullet } from './Bullet.js';
export class Enemy extends PIXI.Sprite {
    constructor(player) {
        super()
        this.player = player
        this.createEnemy()
    }

    async createEnemy() {
        const texture = await PIXI.Assets.load('src/assets/images/enemy1.png')
        this.enemy = new PIXI.Sprite(texture)
        this.enemy.anchor.set(0.5)
        this.enemy.x = Math.random() * 800
        this.enemy.y = 0
        this.addChild(this.enemy)
        this.direction = Math.random() < 0.5 ? 'left' : 'right';
        this.switchInterval = Math.random() * 2000 + 1000; // 1–3 sec
        this.lastSwitchTime = performance.now();


        this.speed = 1.5
        this.rockets = []
        this.shootingInterval = setInterval(() => this.shoot(), 2000)
    }

    moveEnemy() {
        const now = performance.now();
        if (now - this.lastSwitchTime > this.switchInterval) {
            this.direction = this.direction === 'left' ? 'right' : 'left';
            this.switchInterval = Math.random() * 2000 + 1000;
            this.lastSwitchTime = now;
        }

        if (this.direction === 'left') {
            this.enemy.x -= this.speed;
            if (this.enemy.x < 0) this.direction = 'right';
        } else {
            this.enemy.x += this.speed;
            if (this.enemy.x > 800) this.direction = 'left';
        }
        this.enemy.y += 0.5

    }

        shoot() {
            const angle = this.enemy.rotation
            const rocket = new Bullet(this.enemy.x, this.enemy.y, angle, 5)

            rocket.update = () => {
                rocket.x += rocket.vx;
                rocket.y += rocket.vy;
            };


            this.rockets.push(rocket)
            this.parent.addChild(rocket)
        }

        update() {
            this.moveEnemy();
            this.rockets.forEach((r) => r.update());
        }

        destroy() {
            clearInterval(this.shootInterval);
            this.enemy.destroy();
            this.rockets.forEach((r) => r.destroy());
        }

    }
