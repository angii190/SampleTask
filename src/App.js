// src/App.js
import { Application } from "pixi.js";
import Game from "./game/Game.js";
import { Shooter } from "./game/Shooter.js";
import { Bullet } from "./game/Bullet.js";
import { Enemy } from "./game/Enemy.js";

export default class App {
  constructor(config) {
    this._config = config;
    this.app = new Application();
    this.game = null;
    this.shooter = null;
    this.bullet = null;
    this.enemy = null;
    this.bullets = [];
    this.enemies = [];
  }

  // Function to spawn enemies at random intervals
    spawnEnemies() {
      this.enemy = new Enemy(this.shooter);
      this.enemies.push(this.enemy);
      this.app.stage.addChild(this.enemy);
      //this.enemy.rockets.forEach((r) => this.app.stage.addChild(r));
    }

  // Initialize the application
  async init() {
    await this.app.init({
      width: this._config.renderer?.width ?? 800,
      height: this._config.renderer?.height ?? 600,
      background: this._config.renderer?.background ?? "#d0ff13ff",
      antialias: this._config.renderer?.antialias ?? true,
      ...this._config.renderer,
    });

    document.body.appendChild(this.app.canvas);
    // Create game and shooter instances
    this.game = new Game(this._config);
    this.shooter = new Shooter();
    this.app.stage.addChild(this.shooter, this.game);
    this.app.ticker.add((t) => this.game?.update?.(t))

    

    // Spawn an enemy every 4-8 seconds
    setInterval(() => {
      this.spawnEnemies();
    }, Math.random() * 4000 + 4000);




    // Set up shooter's rotation to follow mouse movement
    this.app.stage.eventMode = 'static'; // Enable interaction events
    this.app.stage.on('pointermove', (event) => {
      const mousePos = event.global;
      this.shooter.rotateTo(mousePos.x, mousePos.y);
    });
    //Create an array to hold bullets
    const bullets = [];
    // Handle mouse clicks for shooting and moving
    this.app.stage.on('mousedown', (e) => {
      console.log("Mouse down event:", e);
      // Get mouse position
      const mousePos = e.global
      if (e.button === 0) {
        const bullet = new Bullet(this.shooter.x, this.shooter.y, mousePos.x, mousePos.y);
        console.log("Shooting bullet towards:", mousePos.x, mousePos.y, bullet);
        bullets.push(bullet);
        this.app.stage.addChild(bullet);
      } else if (e.button === 2) {
        this.shooter.moveTo(mousePos.x, mousePos.y);
      }
    });
    // Update bullets in the game loop
    // This is where the error appears - inside the update function, the bullet's sprite is undefined and has no 'x' value
    this.app.ticker.add(() => {
      this.bullets.forEach((b) => b.update());
      this.enemies.forEach((e) => {
    e.update();
    //e.this.rockets.forEach((r) => r.update());
  });

    });

    window.addEventListener('contextmenu', (e) => e.preventDefault());


  }

  start() {
    this.app.start();
  }
}
