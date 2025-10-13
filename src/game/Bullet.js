import * as PIXI from 'pixi.js';
export class Bullet extends PIXI.Sprite {
    constructor(startX, startY, targetX, targetY, speed = 10) {
        super();
        this.createBullet(startX, startY, targetX, targetY, speed = 10);
        console.log("Bullet created", this.bullet);
    }

    // This method creates and adds the bullet sprite to the stage
    async createBullet(startX, startY, targetX, targetY, speed) {
        const texture = await PIXI.Assets.load('src/assets/images/rocket.png');
        this.bullet = new PIXI.Sprite(texture)
        this.bullet.anchor.set(0.5);
        this.bullet.position.set(startX, startY);
        this.addChild(this.bullet);

        const directionX = targetX - startX;
        const directionY = targetY - startY;
        const length = Math.sqrt(directionX * directionX + directionY * directionY);
        this.velocityX = (directionX / length) * speed;
        this.velocityY = (directionY / length) * speed;
    }

    // This method updates the bullet's position
    update() {
        console.log("Bullet position:", this.bullet);
        this.bullet.x += this.velocityX;
        this.bullet.y += this.velocityY;
    }

    // Getter to access the bullet's sprite
    get view() {
        return this.bullet;
    }



}