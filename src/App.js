// src/App.js
import Game from "./game/Game.js";
import { Shooter } from "./game/Shooter.js";
import { Enemy } from "./game/Enemy.js";

import * as PIXI from 'pixi.js';

export default class App {
  constructor(config) {
    this._config = config;
    this.app = new PIXI.Application();
    globalThis.__PIXI_APP__ = this.app;
    this.game = null;
    this.shooter = null;
    this.bullet = null;
    this.enemy = null;
    this.enemies = [];
  }

  isColliding(a, b, radius = 30) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy) < radius;
}

  // Function to spawn enemies at random intervals
  spawnEnemies() {
    this.enemy = new Enemy(this.shooter);
    this.enemies.push(this.enemy);
    this.app.stage.addChild(this.enemy);
    //this.enemy.rockets.forEach((r) => this.app.stage.addChild(r));
    console.log(this.enemy.rockets)
  }

  // Initialize the application
  async init() {
    await this.app.init({
      width: this._config.renderer?.width ?? 800,
      height: this._config.renderer?.height ?? 600,
      background: this._config.renderer?.background ?? "#d0ff13ff",
      antialias: this._config.renderer?.antialias ?? true,
      ...this._config.renderer,
    })
    
   
    document.body.appendChild(this.app.canvas);
    
    // Create game and shooter instances
    this.game = new Game(this._config);
    this.shooter = new Shooter();
    this.app.stage.addChild(this.shooter, this.game);
    this.app.stage.eventMode = 'static'; // Enable interaction events

     this.spawnEnemies()
    // Spawn an enemy every 4-8 seconds
    setInterval(() => {
      this.spawnEnemies();
    }, Math.random() * 2000 + 4000);

  
    // Handle mouse clicks for shooting and moving
    this.app.stage.on('mousedown', (e) => {
      const mousePos = e.global
      if (e.button === 0) {
        const bullet = this.shooter.shooting(mousePos.x, mousePos.y);
        this.shooter.bullets.push(bullet);
        this.app.stage.addChild(bullet);
      } else if (e.button === 2) {
        this.shooter.moveTo(mousePos.x, mousePos.y);
      }
    });

    //Update game loop
    this.app.ticker.add((t) => {
      this.game?.update?.(t);
      this.shooter?.update?.(t);
      if(!this.shooter.bullets) return
      this.shooter.bullets.forEach((b) => b.update());
      this.enemies.forEach((e, eIndex) => {
        e.update();
        if(this.shooter.bullets.length === 0) return
        this.shooter.bullets.forEach((bullet, bIndex) => {
          bullet.update();
          if (this.isColliding(bullet, e)) {
            this.app.stage.removeChild(e)
            e.destroy()
            this.enemies.splice(eIndex, 1)
            this.app.stage.removeChild(bullet.view)
            this.shooter.bullets.splice(bIndex, 1)
          }
        })
        });
      });

    // Set up shooter's rotation to follow mouse movement
    
    this.app.stage.on('pointermove', (event) => {
      const mousePos = event.global;
      this.shooter.rotateTo(mousePos.x, mousePos.y);
    });

    window.addEventListener('contextmenu', (e) => e.preventDefault());

  }

  start() {
    this.app.start();
  }
}
