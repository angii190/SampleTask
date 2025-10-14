import * as PIXI from 'pixi.js';
export class Bullet extends PIXI.Sprite {
    constructor(startX, startY, angle, speed = 10) {
        super();
        this.createBullet(startX, startY, angle, speed = 10);
        console.log("Bullet created", this.bullet);
    }

    // This method creates and adds the bullet sprite to the stage
    async createBullet(startX, startY, angle, speed) {
        const texture = await PIXI.Assets.load('src/assets/images/rocket.png');
        this.bullet = new PIXI.Sprite(texture)
        this.bullet.anchor.set(0.5);
        this.bullet.position.set(startX, startY);
        this.addChild(this.bullet);

        this.velocityX = Math.cos(angle) * speed;
        this.velocityY = Math.sin(angle) * speed;

    }

    // This method updates the bullet's position
    update() {
        this.bullet.x += this.velocityX;
        this.bullet.y += this.velocityY;
    }

    // Getter to access the bullet's sprite
    get view() {
        return this.bullet;
    }



}