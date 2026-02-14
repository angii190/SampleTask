// src/App.js
import Game from "./game/Game.js"
import { Player } from "./game/Shooter.js"
import { Enemy } from "./game/Enemies.js"
import * as PIXI from 'pixi.js'
import { gsap } from "gsap"
export default class App {
  constructor(config) {
    this._config = config;
    this.app = new PIXI.Application()
    globalThis.__PIXI_APP__ = this.app
    this.game = null
    this.player = null
    this.enemies = []
    this.rockets = []
    this.lastEnemySpawn = 0
    this.spawnInterval = this.randomSpawnTime()
    this.gameOver = false
    this.score = 0;
    this.scoreText = null;

  }

  angleTo(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1)
  }

  randomSpawnTime() {
    return 4000 + Math.random() * 4000
  }

  setupControls() {
    this.app.stage.on("contextmenu", e => e.preventDefault())
    this.app.stage.on("pointerdown", e => {
      if (this.gameOver) return

      if (e.button === 0) {
        const rocket = this.player.shoot(this.rocketTexture)
        this.rockets.push(rocket)
        this.app.stage.addChild(rocket)
      }
      if (e.button === 2) {
        this.player.moveTo(this.mousePosition)
      }
    })
  }

  spawnEnemy() {
    const x = Math.random() * this.app.screen.width
    const y = -50; // Just above the visible screen
    const enemy = new Enemy(x, y, this.enemyTexture)
    this.enemies.push(enemy)
    this.app.stage.addChild(enemy) // Make sure you're adding the sprite
  }


  update(delta) {
    if (this.gameOver) return

    // Spawn enemies
    const now = Date.now()
    if (now - this.lastEnemySpawn > this.spawnInterval) {
      this.spawnEnemy()
      this.lastEnemySpawn = now
      this.spawnInterval = this.randomSpawnTime()
    }
    // Update player
    if (this.player) {
      this.player.update(this.mousePosition)
    }

    // Update enemies
    for (const enemy of this.enemies) {
      if (!enemy.isAlive || !this.player?.sprite
      ) continue
      enemy.update(this.player)
      if (enemy.canShoot()) {
        enemy.shoot(this.rockets, this.player, this.rocketTexture)
      }
      if (enemy.checkCollision(this.player)) {
        this.endGame()
        break
      }
    }

    // Track rockets to remove
    const rocketsToRemove = new Set()
    const enemiesToRemove = new Set()

    for (let i = 0; i < this.rockets.length; i++) {
      const rocket = this.rockets[i]
      rocket.update()
      // Rocket hits player
      if (rocket.fromEnemy && rocket.checkCollision(this.player)) {
        // Remove player sprite
        this.app.stage.removeChild(this.player)
        this.endGame()
        rocketsToRemove.add(i)
        continue
      }
      // Rocket hits enemy
      for (const enemy of this.enemies) {
        if (!rocket.fromEnemy && rocket.checkCollision(enemy)) {
          enemiesToRemove.add(enemy)
          rocketsToRemove.add(i)
          break
        }

      }
    }

    // Remove collided enemies with GSAP animation
    for (const enemy of enemiesToRemove) {
      enemy.isAlive = false

      gsap.to(enemy, {
        alpha: 0,
        scale: 2,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          this.app.stage.removeChild(enemy)
        }
      });
      this.score += 1;
      this.scoreText.text = `Score: ${this.score}`;

    }
    this.enemies = this.enemies.filter(e => e.isAlive)
    // Remove collided rockets
    for (const i of [...rocketsToRemove].sort((a, b) => b - a)) {
      this.app.stage.removeChild(this.rockets[i])
      this.rockets.splice(i, 1)
    }
  }

  async loadScoreboard() {
    const res = await fetch('http://localhost:5500/api/scores');
    const scores = await res.json();

    // Remove old scoreboard if it exists
    const old = document.getElementById('scoreboard');
    if (old) old.remove();

    const board = document.createElement('div');
    board.id = 'scoreboard';

    board.style.position = 'absolute';
    board.style.top = '30%';
    board.style.left = '50%';
    board.style.transform = 'translate(-50%, -50%) scale(0.5)';
    board.style.background = 'rgba(0, 0, 0, 0.85)';
    board.style.color = 'white';
    board.style.padding = '30px 40px';
    board.style.borderRadius = '15px';
    board.style.boxShadow = '0 0 25px rgba(255,255,255,0.3)';
    board.style.zIndex = 999;
    board.style.textAlign = 'center';
    board.style.fontFamily = 'Arial, sans-serif';
    board.style.opacity = 0;

    let html = `<h2 style="margin-top:0; font-size:32px;">🏆 Top Scores</h2>`;
    html += scores
      .map((u, i) => `<p style="font-size:20px; margin:6px 0;">${i + 1}. ${u.username}: ${u.highScore}</p>`)
      .join('');

    board.innerHTML = html;
    document.body.appendChild(board);

    // GSAP animation
    gsap.to(board, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)"
    });
  }



  endGame() {
    this.gameOver = true
    const token = localStorage.getItem('token')
    if (token) {
      fetch('http://localhost:5500/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ score: this.score })
      })
    }

    const style = new PIXI.TextStyle({
      fontFamily: "Arial Black",
      fontSize: 64,
      fill: ["#ff0000", "#ffff00"],
      fillGradientType: 1,
      fillGradientStops: [0, 1],

      stroke: "#000000",
      strokeThickness: 6,
      dropShadow: true,
      dropShadowColor: "#000000",
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
    })

    const text = new PIXI.Text("Game Over", style)
    text.anchor.set(0.5)
    text.x = this.app.screen.width / 2
    text.y = this.app.screen.height / 2 - 50
    this.app.stage.addChild(text)
    gsap.to(text, { alpha: 1, y: text.y + 20, duration: 1, ease: "bounce.out" })

    const buttonStyle = new PIXI.TextStyle({
      fontSize: 36,
      fill: "#ffff00",
      stroke: "#000000",
      strokeThickness: 4,
    });


    const button = new PIXI.Text("Play Again", buttonStyle)
    button.interactive = true
    button.buttonMode = true
    button.anchor.set(0.5)
    button.x = this.app.screen.width / 2
    button.y = this.app.screen.height / 2 + 50
    button.on("pointerdown", () => location.reload())
    this.app.stage.addChild(button)

    gsap.to(button, { alpha: 1, duration: 1, delay: 0.5 })
    gsap.to(button.scale, {
      x: 1.05,
      y: 1.05,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })
    this.loadScoreboard()

  }
  async register() {
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const res = await fetch('http://localhost:5500/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()
    alert(data.message || data.error)
  }

  async login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('http://localhost:5500/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);
      this.showLogoutUI();
    } else {
      alert(data.error);
    }
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    //document.getElementById('auth').style.display = 'block';
    document.getElementById('logout').style.display = 'none';
  }

  showLogoutUI() {
    const username = localStorage.getItem('username');
    //document.getElementById('auth').style.display = 'none';
    document.getElementById('logout').style.display = 'block';
    document.getElementById('welcome').textContent = `Welcome, ${username}`;
  }



  async preloadAssets() {
    this.rocketTexture = await PIXI.Assets.load('src/assets/images/rocket.png')
    this.platerTexture = await PIXI.Assets.load('src/assets/images/shooter.png')
    this.enemyTexture = await PIXI.Assets.load('src/assets/images/enemy1.png')
    this.spaceBackgroundTexture = await PIXI.Assets.load('src/assets/images/space_bg.jpg')

    this.app.stage.sortableChildren = true
    this.rocketTexture.zIndex = 10
  }

  scoreDisplay() {
    const style = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 32,
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
    });

    this.scoreText = new PIXI.Text("Score: 0", style);
    this.scoreText.x = 20;
    this.scoreText.y = 20;
    this.scoreText.zIndex = 100;
    this.app.stage.addChild(this.scoreText);

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

    document.body.appendChild(this.app.canvas)
    this.app.stage.eventMode = 'static'
    this.app.stage.hitArea = this.app.screen

    this.game = new Game(this._config)
    this.scoreDisplay()
    //Preload assets
    await this.preloadAssets()
    this.player = new Player(500, 500, this.platerTexture)
    this.app.stage.addChild(this.game)
    this.app.stage.addChild(this.player)
    // Add background  
    const background = new PIXI.Sprite(this.spaceBackgroundTexture)
    background.width = this.app.screen.width
    background.height = this.app.screen.height
    background.zIndex = -1
    this.app.stage.addChild(background)
    window.addEventListener('resize', () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
      background.width = this.app.screen.width;
      background.height = this.app.screen.height;
    });



    const token = localStorage.getItem('token');
    if (token) {
      this.showLogoutUI();

    }

    // Game loop
    this.app.ticker.add((delta) => {
      this.game?.update?.(delta); this.update(delta)
      this.player.rockets.forEach((b) => b.update())
    })

    this.spawnEnemy()

    this.mousePosition = { x: 0, y: 0 }
    // Track mouse movement
    this.app.stage.on('pointermove', (event) => {
      this.mousePosition.x = event.global.x
      this.mousePosition.y = event.global.y
    });
    this.setupControls()

    window.addEventListener('contextmenu', (e) => e.preventDefault())
  }

  start() {
    this.app.start()
  }
}
